
import React from "react";

const MadeByHumans = () => {
  return (
    <section id="made-by-humans" className="w-full bg-white dark:bg-slate-950 py-0 animate-on-scroll opacity-0">
      <div className="section-container pb-2">
        {/* Removed the pulse-chip button/element that was here */}

        <div className="w-full rounded-2xl sm:rounded-3xl overflow-hidden relative mt-6 sm:mt-8">
          <div className="bg-no-repeat bg-cover bg-center p-4 sm:p-5 min-h-[250px] sm:min-h-[350px] flex flex-col justify-between" style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1644426358812-879f02d1d867?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"
          }}>
            <div className="flex items-center text-white">
              <img src="/My-uploads/27b27ae1-593f-43db-bac4-6cbf13acb7de.png" alt="Aster - Care for Life Logo" className="h-8 sm:h-10 w-auto mr-3" />
            </div>

            <div style={{
              overflow: "hidden",
              maxHeight: "80px",
              marginTop: "40px"
            }}>
              <h2 style={{
                marginBottom: "-30px",
                padding: "0px 0px 100px"
              }} className="sm:text-5xl font-playfair text-white italic mt-0 mx-0 font-thin text-6xl md:text-7xl py-0 px-0 text-center lg:text-7xl">
                "Medicine is not only a science; it is also an art"
              </h2>
            </div>

            {/* White box at the bottom with overflow */}
            <div className="w-[120%] none h-10 rounded-t-lg absolute left-[-10%] bottom-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MadeByHumans;
