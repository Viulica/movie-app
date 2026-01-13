import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Movie from "@/models/Movie";
import SavedMovie from "@/models/SavedMovie";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request)
 {
    try 
    {
        await connectDB();
        const { searchParams } = new URL(request.url);

        const saves = await Movie.find({});

        console.log("ALL SAVED MOVIES DUMP: ",saves);

        return NextResponse.json(
        {
          success: true,
          saves,
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
    const { action, movieId } = await request.json();
    await connectDB();

    const movie = await Movie.findById(movieId);
    if(!movie)
    {
      return NextResponse.json(
      {
        success: false,
        message: "error: movie not found"
      })
    }

    
    //todo wrong action, movie already in db case.

    const session = await getServerSession(authOptions);

    const duplicate = await SavedMovie.findOne({
      userId: session.user.id,
      movieId : movieId,
    })
    if(duplicate)
    {
      return NextResponse.json(
      { success: false, message: "already saved"}
    );
    }

    const save = await SavedMovie.create({
        userId: session.user.id,
        movieId,
    });

    console.log("saved movie = ",save);

    return NextResponse.json({success: true})
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

  const deleting = await SavedMovie.findOneAndDelete(
   {
     movieId: movieId,
     userId : session.user.id,
   })

  if(deleting)
  {
    return NextResponse.json(
        {
            success: true,
            message: "removed from saves list",
        })
  }
  else{
    console.log("error while unsaving");
  }
}
