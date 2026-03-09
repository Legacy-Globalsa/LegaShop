import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import familyImg from "@/assets/family-ph.jpg";

const RemittancePreview = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container">
        <Link
          to="/remittance"
          className="group relative rounded-2xl overflow-hidden block h-[220px] md:h-[260px]"
        >
          <img
            src={familyImg}
            alt="Send groceries to your family in the Philippines"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-destructive/90 via-destructive/70 to-transparent" />
          <div className="absolute inset-0 flex items-center px-6 md:px-12">
            <div className="max-w-lg">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-white fill-white" />
                <span className="text-white/80 text-xs font-semibold uppercase tracking-wider">
                  Padalang Pagmamahal
                </span>
              </div>
              <h3 className="text-2xl md:text-4xl font-extrabold text-white leading-tight">
                Send Groceries to Your<br />Pamilya in the Philippines
              </h3>
              <p className="text-white/70 text-sm md:text-base mt-2 max-w-md">
                Order from Puregold — delivered straight to your family's doorstep back home.
              </p>
              <span className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full bg-white text-destructive font-bold text-sm group-hover:gap-3 transition-all shadow-lg">
                Send Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default RemittancePreview;
