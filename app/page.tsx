import { ActivationStep } from "@/components/ActivationStep";
import Accordion from "@/components/Accordion/Accordion";
import Carousel from "@/components/Carousel";
import Map from "@/components/Map/Map";
import Coordinate from "@/components/Map/coordinate.model";

const activationSteps = [
  {
    number: "1",
    title: "Choose Pack",
    text: "Select the tourist pack that fits your needs",
    img: "/images/choosePack.jpg",
  },
  {
    number: "2",
    title: "Click Activate",
    text: "Press the activate button on your chosen pack",
    img: "/images/install.jpg"

  },
  {
    number: "3",
    title: "Start Using",
    text: "Your pack is ready to use immediately",
    img: "/images/startUsing.jpg"

  },
];

const faqData = [
  {
    id: 1,
    title: 'Why should I buy a Digital Tourist Pack?',
    description: 'A Digital Tourist Pack offers a cost-effective solution with lower prices than physical Vodafone shops, providing an efficient online experience for all your travel needs.A Digital Tourist Pack offers a cost-effective solution with lower prices than physical Vodafone shops, providing an efficient online experience for all your travel needs.' },
  {
    id: 2,
    title: 'How do I activate my Sim Card? Can I go to any Vodafone shop?',
    description: 'You can activate your SIM card easily by visiting any Vodafone shop during business hours, ensuring a hassle-free process. Just make sure to provide your order number & details found on your confirmation email as well as a valid ID or passport to pick up your SIM card.'
  },
  {
    id: 3,
    title: 'Can I use Tourist Pack in the Region?',
    description: 'Yes, you can use the Tourist Pack in the Western Balkans region without any extra cost or need to purchase a Roaming Bundle, as it offers all capabilities seamlessly across the area. For more information on the details of Roaming in the Western Balkans, please refer to: Roaming in Western Balkans | Vodafone'
  }
];
const locations = [
  { lat: 41.323933070770984, lng: 19.776707176223635, storeName: "Vodafone Yzberisht" },
  { lat: 41.31451571661562, lng: 19.76855470712155,storeName: "Vodafone Kombinat" },
  { lat: 41.339030547942, lng: 19.790678501288255, storeName: "Vodafone Blloku" },
  { lat: 41.32547697651594, lng: 19.803362835011733, storeName: "Vodafone 21 Dhjetori" }
];

export default function HomePage() {
  function transformCoordinates():Coordinate[]{
    return locations!.map(t=>{
      const coordinate: Coordinate = {lat: t.lat, lng: t.lng, message: t.storeName};
      return coordinate;
    })
  }
  return (
    <div className="page">
      <img src="https://home.vodafone.al/tourist/_next/static/media/Desktop_EN.92db70a3.jpeg" alt="banner-img"/>
      <main className="main">
        {/* Hero Section */}
        <section className="hero">
          <h1 className="hero-title">Welcome to <span className="highlightTxt">Vodafone Albania</span></h1>
          <p className="hero-text">
            Stay connected during your visit to Albania with our special tourist
            packages. Choose the perfect plan for your needs.
          </p>
        </section>

        <Carousel/>

        <h2 className="section-title">How to Activate</h2>
        <div className="steps">
          {activationSteps.map((step, index) => (
            <ActivationStep
              key={index}
              number={step.number}
              title={step.title}
              text={step.text}
              img={step.img}
            />
          ))}
        </div>
        <div className="map-container">
          <h2 className="section-title">Or you can come at one of our stores:</h2>
          <Map notAllowClicks={true} coordinates={transformCoordinates()}></Map>
        </div>
        <div className="faq-container">
          <h1 className="section-title">Frequently Asked <span className="color-red">Questions</span></h1>
          {faqData.map(item => (
              <Accordion
                  key={item.id}
                  title={item.title}
                  description={item.description}
              />
          ))}
        </div>
      </main>
    </div>
  );
}
