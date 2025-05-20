import React from "react";
import { FaHeart, FaBookmark, FaComment, FaUtensils } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

// Simple Logo Component
const Logo = () => (
    <div className="flex items-center">
        <img src="/logo.png" alt="Kulinarasa Logo" className="h-10 mr-2" />
        <span className="font-bold text-2xl text-orange-800 font-kulinarasa">Kulinarasa</span>
    </div>
);

const features = [
    {
        icon: <FaHeart className="text-kulinarasa-yellow text-2xl" />,
        title: "Like Recipes",
        desc: "Temukan resep favoritmu dan beri tanda suka pada resep yang kamu sukai.",
    },
    {
        icon: <FaComment className="text-kulinarasa-orange text-2xl" />,
        title: "Comment Freely",
        desc: "Diskusikan trik masak, tanya bahan, dan bagikan pendapatmu.",
    },
    {
        icon: <FaBookmark className="text-kulinarasa-yellow text-2xl" />,
        title: "Save for Later",
        desc: "Simpan resep menarik ke daftar favoritmu untuk dimasak nanti.",
    },
];

export default function LandingPage() {
    const navigate = useNavigate();

    const handleRegisterButton = (e) => {
        e.preventDefault();
        navigate('/register');
    };

        const handleLoginButton = (e) => {
        e.preventDefault();
        navigate('/login');
    };
    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center px-6">
            {/* Hero Section with logo in top left */}
            <div className="w-full max-w-7xl relative pt-6">
                <div className="absolute top-6 left-0 z-10">
                    <Logo />
                </div>
                <section className="w-full max-w-7xl flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20">
                    {/* Text Content */}
                    <div className="flex-1 text-left ml-5">
                        <h1 className="text-4xl md:text-5xl font-bold font-kulinarasa text-orange-800 mb-4">
                            Jelajahi dan Bagikan Resep Masakan Nusantara
                        </h1>
                        <p className="text-lg text-gray-700 mb-6">
                            Dari Rendang hingga Pempek — temukan dan bagikan resep autentik dari seluruh penjuru Indonesia. Platform interaktif untuk pecinta kuliner sejati!
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-kulinarasa-brown hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow" onClick={handleRegisterButton}>
                                Mulai Menjelajah
                            </button>
                            <button className="bg-kulinarasa-orange hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow" onClick={handleLoginButton}>
                                Masuk Kembali
                            </button>
                        </div>
                    </div>

                    {/* Image Content */}
                    <div className="flex-1 max-w-full overflow-hidden">
                        <img
                            src="https://images.pexels.com/photos/2802527/pexels-photo-2802527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                            alt="Indonesian food"
                            className="rounded-2xl shadow-lg object-contain w-full h-auto -rotate-90"
                        />
                    </div>
                </section>

                {/* Features Section */}
                <section className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition text-center"
                        >
                            <div className="mb-4 flex justify-center items-center">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-orange-700">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* Footer*/}
                <footer className="mt-24 text-center text-sm text-gray-500 mb-5">
                    © {new Date().getFullYear()} Kulinarasa
                </footer>
            </div>
        </div>
    );
}