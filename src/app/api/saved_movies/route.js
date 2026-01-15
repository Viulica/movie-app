import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/models/Movie";
import SavedMovie from "@/models/SavedMovie";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/*
  /api/saved_movies?type=popularity - returns a table of popularity scores by movieId
  /api/saved_movies - returns a raw list of all userId-movieId relationships
*/
export async function GET(request)
 {
    try 
    {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");

        const saves = await SavedMovie.find({});

        if (type === "popularity") {

          // popularity algorithm

      
          /// filter out saves older than designated time window
          const timeRange = searchParams.get("timeRange");
          const timeOfReq = Date.now();
          let maxTime = 86400000; //1 day
          if (timeRange=="week") maxTime = maxTime * 7;
          if (timeRange=="month") maxTime = maxTime * 30;
          if (timeRange=="year") maxTime = maxTime * 360;

          const dateFilter = saves.filter(s =>
            new Date(s.createdAt).getTime() > timeOfReq - maxTime
          );

          /// popularity gain from a save/rating
          function calculateValue(rtng, date) {
            if(rtng==1) return 0;
            const timeSinceEntry = Date.now() - date.getTime();
            const lifespanPerc = timeSinceEntry / maxTime;
            const dateImportance = 0.18;
            if(!rtng)
            {
              return 1 - lifespanPerc * dateImportance;
            }
            let base = rtng / 3;
            return base - base * lifespanPerc * dateImportance;
          }

          /// calculate popularity score for each saved movie
          const scoreMap = dateFilter.reduce((acm,s) => {
            acm[s.movieId] = (acm[s.movieId] || 0)+calculateValue(s.rating, s.updatedAt);
            return acm;
          }, {});
          const sorted = Object.fromEntries(
            Object.entries(scoreMap).sort(([,a],[,b]) => b-a)
          );
          const final = JSON.stringify(sorted);

          console.log("popularity scores: ",final);
          return NextResponse.json(
          {
            success: true,
            final
          });
        }

        // default - no search type requested, return all saves
        return NextResponse.json(
        {
          success: true,
          saves
        });
    }
    catch(error)
    {
        return NextResponse.json(
              { success: false, error: error.message },
              { status: 500 }
            );
    }
}

export async function POST(request) {
  try {
    const { action, movieId, rating } = await request.json();
    await connectDB();

    // movie id not in database

    const movie = await Movie.findById(movieId);
    if(!movie)
    {
      return NextResponse.json(
      {
        success: false,
        message: "error: movie not found"
      })
    }

    const session = await getServerSession(authOptions);

    switch(action)
    {
      //saving
      
      case "save":
      const duplicate = await SavedMovie.findOne({
        userId: session.user.id,
        movieId : movieId,
      })
      if(duplicate)
      {
        duplicate.saved = true;
        await duplicate.save();
        return NextResponse.json(
        {
            success: true,
            message: "saved",
        })
      }

      const save = await SavedMovie.create({
          userId: session.user.id,
          movieId,
          saved : true
      });

      return NextResponse.json({success: true});
      break;

      // rating

      case "rate":
        const mv = await SavedMovie.findOne({
        userId: session.user.id,
        movieId : movieId,
        })
        // movie alrady saved
        if(mv)
        {
          mv.rating = rating;
          await mv.save();
          
          return NextResponse.json(
          { success: true, message: "movie rated"});
        }
        // movie not saved, create new entry and rate
        else
        {
          const save = await SavedMovie.create({
          userId: session.user.id,
          movieId,
          saved : false,
          rating : rating
          });
          return NextResponse.json(
          {
            success: true,
            message: "rated",
          })
        }
        break;
    }
  }
  catch(error)
  {
    console.error("Error in POST /api/saved_movies:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDB();
  const session = await getServerSession(authOptions);

  const { action, movieId } = await request.json();

  const save = await SavedMovie.findOne(
  {
    movieId: movieId,
    userId : session.user.id
  }
  )

  // delete the entry from db
  if(!save.rating)
  {
    const deleting = await SavedMovie.deleteOne(
   {
     movieId: movieId,
     userId : session.user.id,
   })

  if(deleting)
  {
    return NextResponse.json(
    {
        success: true,
        message: "unsaved",
    })
  }
  else
  {
    console.log("error while unsaving");
  }
  }
  // rating exists, so only unsave movie
  else
  {
    save.saved = false;
    await save.save();
    return NextResponse.json(
    {
        success: true,
        message: "unsaved",
    })
  }

  
}
