import { stats } from "@/constants";

const HeroBanner = () => {
    return (
        <div className="relative w-full h-[420px] sm:h-[520px] lg:h-[560px] rounded-2xl md:rounded-4xl overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
                alt="hero banner image"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-black/60" />

            <div className="absolute inset-0 flex flex-col items-center px-6 justify-center gap-4 text-center text-white">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold font-sn-pro">Find your next favourite <br /> meal.</h1>
                <p className="text-white/80 text-sm sm:text-base">Join a community of 50,000+ home cooks sharing their best secrets.</p>
                <div>
                    <div className="flex items-center justify-center mt-12">
                        {stats.map((stat) => {
                            return (
                                <div className=" flex flex-col p-4 justify-center items-center">
                                    <p className="text-5xl font-medium">{stat.value} <sup className="-ml-3">+</sup> </p>
                                    <h1 className="-ml-4">{stat.name}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroBanner;