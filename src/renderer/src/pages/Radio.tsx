import { FC, useState, useRef, useEffect } from 'react';
import './Radio.css';
import './Social.css';
import './pagina.css';
import { IoSettings } from "react-icons/io5";
import axios from 'axios';

interface Track {
    title: string;
    artist: string;
    url: string;
}

const Radio: FC = () => {
    /* Radio */
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);

    const tracks: Track[] = [
        {
            title: 'Radio Paradise Rock',
            artist: 'Rock',
            url: 'https://stream.radioparadise.com/rock-320'
        },
        {
            title: 'Groove Salad',
            artist: 'Ambient',
            url: 'http://ice1.somafm.com/groovesalad-256-mp3'
        },
        {
            title: 'Deep Space One',
            artist: 'Space',
            url: 'http://ice1.somafm.com/deepspaceone-128-mp3'
        }
    ];

    const handlePlayPause = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleNext = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % tracks.length);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prevIndex) => (prevIndex - 1 + tracks.length) % tracks.length);
    };

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(event.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume / 100;
        }
    };

    const handleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
            audioRef.current.src = tracks[currentTrackIndex].url;
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    }, [currentTrackIndex]);

    /* Social */
    const [publicaciones, setPublicaciones] = useState<any[]>([]);

    useEffect(() => {
        // Realizar la solicitud HTTP a la API
        const fetchPublicaciones = async () => {
            try {
                const response = await fetch('http://localhost:5000/publicaciones');
                const data = await response.json();
                setPublicaciones(data); // Establecer las publicaciones en el estado
            } catch (error) {
                console.error('Error al obtener las publicaciones:', error);
            }
        };

        fetchPublicaciones(); // Llamar a la función para obtener las publicaciones
    }, []); // El array vacío asegura que solo se ejecute una vez cuando el componente se monte


    /*publicar*/
    const [foto, setFoto] = useState('');
    const [texto, setTexto] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const postData = {
            foto: foto,
            texto: texto,
            fecha_publicacion: new Date().toISOString() // Usa la fecha actual en formato ISO
        };

        try {
            const response = await axios.post('http://localhost:5000/publicar', postData);

            // Actualiza la lista de publicaciones sin hacer otro fetch
            setPublicaciones((prevPublicaciones) => [...prevPublicaciones, postData]);

            console.log('Publicación realizada con éxito:', response.data);
        } catch (error) {
            console.error('Error al publicar:', error);
        }
    };

    /*Eliminar */
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:5000/publicaciones/${id}`);
            setPublicaciones((prevPublicaciones) =>
                prevPublicaciones.filter((pub) => pub.id !== id)
            );
        } catch (error) {
            console.error("Error al eliminar la publicación:", error);
        }
    };

    // Vuelve a obtener las publicaciones cuando el estado cambie
    useEffect(() => {
        const fetchPublicaciones = async () => {
            try {
                const response = await fetch("http://localhost:5000/publicaciones");
                const data = await response.json();
                setPublicaciones(data);
            } catch (error) {
                console.error("Error al obtener las publicaciones:", error);
            }
        };

        fetchPublicaciones();
    }, [publicaciones]);

    /* Modal */
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <div>
            <a className='icon-config' onClick={openModal}><IoSettings /> <span>Configuración</span></a>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Configuración</h2>
                        <label>Configuración base de datos</label>

                        <button onClick={closeModal}>Cerrar</button>

                    </div>
                </div>
            )}


            <div className='d-flex flex-row'>

                <div className='d-flex flex-column'>
                    {/*publicacion*/}
                    <div >
                        <form onSubmit={handleSubmit} className='formulario'>
                            <label>
                                Foto:
                                <input
                                    type="text"
                                    value={foto}
                                    onChange={(e) => setFoto(e.target.value)}
                                />
                            </label>
                            <label>
                                Texto:
                                <input
                                    className='comentar'
                                    type="text"
                                    value={texto}
                                    onChange={(e) => setTexto(e.target.value)}
                                />
                            </label>

                            <button type="submit">Publicar</button>
                        </form>

                    </div>


                    {/*getpublicaciones*/}

                    <div className="publicaciones-container">
                        <h2>Publicaciones</h2>
                        <ul>
                            {publicaciones.map((publicacion, index) => (
                                <li key={index}>
                                    <img src={publicacion.foto} alt={publicacion.titulo} className="publicacion-imagen" />
                                    <p>{publicacion.texto}</p>
                                    <p>{new Date(publicacion.fecha_publicacion).toLocaleDateString('es-CL', {
                                        weekday: 'long', // Día de la semana (Opcional)
                                        year: 'numeric', // Año
                                        month: 'long', // Mes
                                        day: 'numeric', // Día
                                    })}</p>
                                    <button onClick={() => handleDelete(publicacion.id_publicacion)}>❌ Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>

                <div className="radio-container">
                    <div className="player-container">
                        <audio ref={audioRef} />
                        <div className="player-controls">
                            <button onClick={handlePlayPause}>{isPlaying ? '⏸ Pause' : '▶ Play'}</button>
                            <button onClick={handleStop}>⏹ Stop</button>
                            <button onClick={handlePrev}>⏮ Prev</button>
                            <button onClick={handleNext}>⏭ Next</button>
                            <button onClick={handleMute}>{isMuted ? '🔇 Unmute' : '🔊 Mute'}</button>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={volume}
                                onChange={handleVolumeChange}
                            />
                        </div>
                        <div className="current-track">
                            {tracks[currentTrackIndex].title} - {tracks[currentTrackIndex].artist}
                        </div>
                    </div>
                    <div className="track-list-container">
                        <h2>Available Stations</h2>
                        <ul className="track-list">
                            {tracks.map((track, index) => (
                                <li
                                    key={index}
                                    className={index === currentTrackIndex ? 'active' : ''}
                                    onClick={() => setCurrentTrackIndex(index)}
                                >
                                    {track.title} - {track.artist}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default Radio;
