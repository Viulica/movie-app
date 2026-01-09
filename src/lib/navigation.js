import { Search, Heart, Eye } from "lucide-react";

const navigationLinks = [
  {
    title: "Istraži",
    url: "/explore",
    icon: Search,
  },
  {
    title: "Omiljeni",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Gledano",
    url: "/watched",
    icon: Eye,
  },
];

export { navigationLinks };
