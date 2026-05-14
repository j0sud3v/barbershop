import { useEffect, useState } from 'react';
import CardServices from '../cardservices/CardServices';
import api from '../../../api/api';

const RenderCardServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await api.get('/servicios');
        setServices(response.data);
        console.log('Datos obtenidos:', response.data);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  if (loading) {
    return <h1 className="text-center text-white p-8">Cargando servicios...</h1>;
  }

  return (
    <>
      {services && services.length > 0 ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 w-full place-items-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.80), rgba(0,0,0,.98)), url('https://www.shutterstock.com/image-illustration/seamless-clippers-barber-tools-blackground-600nw-2465006121.jpg')`
          }}
        >
          {services.map((service, index) => {
            const isLast = index === services.length - 1;
            const isOdd = services.length % 2 !== 0;

            return (
              <div
                key={service.nameService || index}
                className={`
                  w-full flex justify-center
                  ${isLast && isOdd ? 'sm:col-span-2 lg:col-span-1' : ''}
                `}
              >
                <CardServices
                  image={service.image || ''}
                  nameService={service.nameService}
                  description={service.descripcion || service.description || ''}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <h1 className="text-center p-8 text-gray-500">
          No hay servicios disponibles
        </h1>
      )}
    </>
  );
};

export default RenderCardServices;