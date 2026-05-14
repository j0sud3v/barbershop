import { motion } from "framer-motion";

type ServiceProps = {
  image: string;
  nameService: string;
  description: string;
};

const CardServices = ({ image, nameService, description }: ServiceProps) => {
  return (
    <motion.div
      className="
        h-120 w-80 m-10 rounded-4xl shadow-2xl/10 bg-black 
        flex flex-col items-center justify-center
        overflow-hidden anthelion
      "
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}

      whileHover={{
        scale: 1.08,
        y: -10,
        boxShadow: "0px 20px 40px rgba(0,0,0,0.3)"
      }}
    >
      <img src={image} alt="image-ref" className="w-50 h-80" />

      <div className="p-5 text-center">
        <h2 className="text-3xl mb-3 text-gray-400">
          {nameService}
        </h2>
        <p className="text-gray-200 font-light">{description}</p>
      </div>
    </motion.div>
  );
};

export default CardServices;