import { Search, Heart, Star, Sparkles, TrendingUp } from "lucide-react";

const navigationLinks = [
  {
    title: "Istraži",
    url: "/explore",
    icon: Search,
  },
  {
    title: "Popularno",
    url: "/popular",
    icon: TrendingUp,
  },
  {
    title: "Preporučeno",
    url: "/recommended",
    icon: Sparkles,
  },
  {
    title: "Spremljeno",
    url: "/saved",
    icon: Heart,
  },
  {
    title: "Ocijenjeno",
    url: "/rated",
    icon: Star,
  },
];

export { navigationLinks };
