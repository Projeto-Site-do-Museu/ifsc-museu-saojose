import React from "react";
import Image from 'next/image';
import { FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
    return(
    <footer className="bg-[#010921] max-w-[1200px] m-auto">


            <div className="flex flex-row items-center justify-between p-4">
            
            <div className="flex flex-row justify-left">
                <Image
                            src="/imgs/logo.png"
                            alt="Logo"
                            width={128}
                            height={128}
                            className="mr-3"
                          />
                {/* <Image
                            src="/imgs/logo.png"
                            alt="Logo"
                            width={64}
                            height={64}
                            className="mr-3 block md:hidden"
                          /> */}
                <div className="text-center">
                    <h1 className="text-white font-michroma text-lg hidden md:block">Museu histórico de São José</h1>
                    <p className="text-gray-400 text-xs hidden md:block">
                    Rua Gaspar Neves, 3175 -  88103-250
                    </p>
                    <p className="text-gray-400 text-xs ">
                    (48) 3381-0000
                    </p>
                    <p className="text-gray-400 text-xs ">
                    Horários: de segunda a sexta feira, das 8:00 às 18:00 horas. 
                    </p>
                </div>

            </div>
            

            <div className="flex flex-col items-center">
                <h2 className="text-white font-michroma text-sm">Nos acompanhe</h2>
                <div className="flex space-x-4 mt-2">
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                    <FaInstagram className="text-white text-2xl hover:text-gray-400" />
                </a>
                <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
                    <FaTiktok className="text-white text-2xl hover:text-gray-400" />
                </a>
                </div>
            </div>
            </div>
    </footer>
    );
};

export default Footer;