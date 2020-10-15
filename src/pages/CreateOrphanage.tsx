import React, { ChangeEvent, FormEvent, useState } from "react";
import { Map, Marker, TileLayer} from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from "react-icons/fi";
import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";
import api from "../services/api";
import { useHistory } from "react-router-dom";



export default function CreateOrphanage() {

  const [ position, setPosition ] = useState({ latitude: 0, longitude: 0});
  const [name, setName ] = useState('');
  const [about, setAbout ] = useState('');
  const [instructions, setInstructions ] = useState('');
  const [opening_hours, setOpeningHours ] = useState('');
  const [open_on_weekends, setOpenOnWeekends ] = useState(true);
  const [images, setImages ] = useState<File[]>([]);
  const [previewImages, setPreviewImages ] = useState<string[]>([]);

  const history = useHistory();

  function handleSelectImages(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files){
      return ;
    }
    const selectedImages = Array.from(event.target.files);

    setImages(selectedImages);
    const selectedImagesPreview = selectedImages.map(img => {
      return URL.createObjectURL(img);
    });

    setPreviewImages(selectedImagesPreview);

  }
  
  function handleMapClick(event: LeafletMouseEvent) {

    const { lat, lng} = event.latlng;

    setPosition({
      latitude: lat,
      longitude: lng,
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', opening_hours);
    data.append('open_on_weekends', String(open_on_weekends));
    images.forEach(img => {
      data.append('images', img);
    });

    await api.post('orphanages', data);

    alert('Cadstro realizado com sucesso');

    history.push('/app');
  }

  return (
    <div id="page-create-orphanage"> 
    
    <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="create-orphanage-form">
          <fieldset>
            <legend>Dados</legend>
            <Map
                center={[-21.2556811,-48.3263187]}
                zoom={16}
                style={{ width:'100%', height:280}}
                onclick={handleMapClick}
                
            >

             <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {position.latitude !== 0 && (<Marker interactive={false} icon={mapIcon} position={[position.latitude ,position.longitude]} />) }
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name" value={name} onChange={event => setName(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="about" maxLength={300}
              value={about} onChange={event => setAbout(event.target.value)}/>
              
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {previewImages.map(img => {
                    return (<img key={img} src={img} alt={name} />);
                })}

                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
                
              </div>
              <input multiple onChange={handleSelectImages} type="file" name="image" id="image[]"/>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions" 
              value={instructions} onChange={event => setInstructions(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horario de Funcionamento</label>
              <input id="opening_hours" 
              value={opening_hours} onChange={event => setOpeningHours(event.target.value)}/>
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button 
                type="button" 
                className={open_on_weekends? 'active' : ''}
                onClick={() => setOpenOnWeekends(true)}>
                  Sim</button>
                <button 
                className={!open_on_weekends? 'active' : ''}
                type="button"
                onClick={() => setOpenOnWeekends(false)}>
                  Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
