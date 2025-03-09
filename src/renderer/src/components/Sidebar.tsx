import { FC, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoHome, IoSettings } from "react-icons/io5";
import { FaRadio } from "react-icons/fa6";
import { FaCommentAlt } from 'react-icons/fa';

const Sidebar: FC = () => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null); // Estado para rastrear el índice clicado

  const handleClick = (index: number) => {
    setClickedIndex(index); // Establece el índice del elemento clicado
  };

  const menuItems = [
    { label: 'Home', icon: <IoHome  size={24} />, href: '/' },
    { label: 'Radio', icon: <FaRadio  size={24} />, href: '/Radio' },
    { label: 'Social', icon: <FaCommentAlt  size={24} />, href: '/Social' },
    { label: 'Configuracion', icon: <IoSettings  size={24} />, href: '/Configuracion' },
  ];

  return (
    <div className="container-fluid content">
      <div className="row">
        <div className="col-sm-auto bg-light position-fixed h-100">
          <div className="nav flex-column">
            {menuItems.map((itemData, index) => (
              <li
                key={index} // Asegura que cada ítem tenga una clave única
                className="nav-item"
                onClick={() => handleClick(index)} // Actualiza el índice al hacer clic
              >
                <a
                  className={`d-block p-3 link-dark text-decoration-none ${clickedIndex === index ? 'active' : ''}`} // Aplica la clase 'active' si el ítem está clicado
                  href={itemData.href}
                >
                  {itemData.icon}
                </a>
              </li>
            ))}
          </div>
        </div>

        <div className="col-sm-9 offset-sm-3">
          {/* Aquí va el contenido principal */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
