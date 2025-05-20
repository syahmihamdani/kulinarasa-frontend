import React, { useEffect, useState } from "react";
import { FaHeart, FaBookmark, FaComment, FaUtensils, FaArrowDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const styles = {
  fadeIn: {
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
  },
  visible: {
    opacity: 1,
    transform: 'translateY(0)'
  }
};

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

const aboutSections = [
    {
        title: "Tentang Kulinarasa",
        content: "Kulinarasa adalah platform berbagi resep yang mempertemukan para pecinta kuliner Indonesia. Kami percaya setiap masakan memiliki cerita uniknya sendiri.",
        image: "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        title: "Misi Kami",
        content: "Melestarikan dan membagikan kekayaan kuliner nusantara melalui platform yang memudahkan siapa saja untuk berbagi resep warisan keluarga mereka.",
        image: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
        title: "Bergabunglah Bersama Kami",
        content: "Mari menjadi bagian dari komunitas kuliner terbesar di Indonesia. Bagikan resepmu dan temukan inspirasi dari ribuan resep lainnya.",
        image: "https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
];

export default function LandingPage() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    } else {
                        entry.target.style.opacity = '0';
                        entry.target.style.transform = 'translateY(20px)';
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleRegisterButton = (e) => {
        e.preventDefault();
        navigate('/home');
    };

    const handleLoginButton = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const scrollToAbout = () => {
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`min-h-screen bg-orange-50 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Hero Section */}
            <div className="min-h-screen relative flex flex-col items-center px-6">
                <div className="w-full max-w-7xl relative pt-6">
                    <div className="absolute top-6 left-0 z-10">
                        <Logo />
                    </div>
                    <section className="min-h-screen w-full max-w-7xl flex flex-col-reverse md:flex-row items-center gap-10 md:gap-20">
                        {/* Text Content */}
                        <div className="flex-1 text-left ml-5">
                            <h1 className="text-4xl md:text-5xl font-bold font-kulinarasa text-orange-800 mb-4">
                                Jelajahi dan Bagikan Resep Masakan Nusantara
                            </h1>
                            <p className="text-lg text-gray-700 mb-6">
                                Dari Rendang hingga Pempek — temukan dan bagikan resep autentik dari seluruh penjuru Indonesia. Platform interaktif untuk pecinta kuliner sejati!
                            </p>
                            <div className="flex gap-4">
                                <button 
                                    className="bg-kulinarasa-brown hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors duration-300" 
                                    onClick={handleRegisterButton}
                                >
                                    Jelajahi Sekarang
                                </button>
                                <button className="bg-kulinarasa-orange hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors duration-300" onClick={handleLoginButton}>
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

                    {/* Scroll Down Button */}
                    <button 
                        onClick={scrollToAbout}
                        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-kulinarasa-orange hover:text-kulinarasa-brown transition-colors duration-300"
                    >
                        <FaArrowDown className="animate-bounce text-3xl" />
                    </button>
                </div>
            </div>

            {/* Features Section */}
            <div id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className="animate-on-scroll bg-white p-6 rounded-2xl shadow hover:shadow-lg"
                                style={{ transitionDelay: `${idx * 200}ms` }}
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
                    </div>
                </div>
            </div>

            {/* About Sections */}
            {aboutSections.map((section, idx) => (
                <div key={idx} className={`py-20 ${idx % 2 === 0 ? 'bg-orange-50' : 'bg-white'}`}>
                    <div className="max-w-7xl mx-auto px-6">
                        <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10`}>
                            <div className="animate-on-scroll md:w-1/2">
                                <h2 className="text-3xl font-kulinarasa font-bold text-kulinarasa-orange mb-4">
                                    {section.title}
                                </h2>
                                <p className="text-lg text-gray-700">
                                    {section.content}
                                </p>
                            </div>
                            <div className="animate-on-scroll md:w-1/2" style={{ transitionDelay: '200ms' }}>
                                <img
                                    src={section.image}
                                    alt={section.title}
                                    className="rounded-2xl shadow-lg w-full h-[300px] object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Footer */}
            <footer className="animate-on-scroll bg-kulinarasa-darkblue text-white py-10">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <Logo />
                    <p className="mt-4">© {new Date().getFullYear()} Kulinarasa. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
