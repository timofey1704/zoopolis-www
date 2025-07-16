import Image from "next/image"
import { getFAQs } from "@/lib/main/fetchFAQ"
import FAQ from "@/components/FAQ"
import Button from "@/components/ui/Button"
import Dog4 from '../public/dog4.png'
import Cat2 from '../public/cat2.png'
import Dog2 from '../public/god2.png'
import Cat1 from '../public/cat1.png'
import Dog3 from '../public/dog3.png'
import Brelok from '../public/brelok.png'
import MediaSlider from "@/components/MediaSlider"

export default async function Home() {
const faqs = await getFAQs()

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col items-center justify-center">

     <div className="flex justify-center items-center gap-10 my-8">
        <Image src={Dog2} alt="dog" width={289} height={263} />
        <div className="flex flex-col justify-center items-center space-y-5">
        <h2 className="text-white">
          <span className="text-black">ВАШ ПИТОМЕЦ</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">ПОТЕРЯЛСЯ</span>
          </span>
          
          <br />
          <span className="text-black flex items-center justify-center mt-2">ЧТО ДАЛЬШЕ?</span>
        </h2>
        <div className="text-black text-center">Бумажные жетоны теряются, информация устаревает. Номер на ошейнике не всегда виден или может быть неактуален. 
        Ценные минуты тратятся впустую.</div>
      
        </div>
        <Image src={Cat1} alt="cat" width={289} height={263} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
          {/* плашка отзывов */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-gray/80 backdrop-blur-sm rounded-[52px] px-10 py-4 shadow-lg">
            <div className="flex flex-col items-center gap-2">
              <Image src='./reviewIcon.svg' alt="star" width={140} height={24} />
              <span className="text-base ">Средняя оценка</span>
            </div>
          </div>
          
          <div className="space-y-11">
            <h2 className="font-bold leading-tight text-gray-900">
              Мы создали QR решения, которые помогают питомцам вернутся домой, 
              а их хозяевам - оставаться спокойными.
            </h2>
            <div className="relative overflow-hidden">
              <Image 
                src={Dog3} 
                alt="dog" 
                width={598} 
                height={480}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative overflow-hidden">
              <Image 
                src={Brelok} 
                alt="cat" 
                width={400} 
                height={330}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-3">
              <p>
                С 2020 года создаём QR-кулон для наших мохнатых друзей. Наша команда — ветеринары, разработчики и просто любители питомцев, понимающие, как важно быстро получить помощь в критический момент.
              </p>
              <p>
                Все данные защищены: серверы, шифрование и строгая конфиденциальность. Доступ к информации — только у тех, кому вы его открыли.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-10 my-8">
        <h2 className="text-white">
          <span className="text-black">МЫ НА</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">МЕРОПРИЯТИЯХ</span>
          </span>
        </h2>
        <MediaSlider />
      </div>

      <FAQ faqs={faqs} />

      <div className="flex justify-center items-center gap-10 my-8">
        <Image src={Dog4} alt="dog" width={289} height={263} />
        <div className="flex flex-col justify-center items-center space-y-5">
        <h2 className="text-white">
          <span className="text-black">Не ждите беды.</span>
          <span className="relative inline-block px-1 mx-2">
            <span className="absolute bg-orange rotate-3 rounded-3xl -inset-1" />
            <span className="relative text-white">Защитите</span>
          </span>
          <span className="text-black">того</span>
          <br />
          <span className="text-black">кто вас любит, прямо сейчас</span>
        </h2>
        <div className="text-black text-center">3 месяца Зоо ID-подписки в подарок при покупке QR-кулона!</div>
        <Button text="Защитить питомца" className="bg-orange text-white" />
        </div>
        <Image src={Cat2} alt="cat" width={289} height={263} />
      </div>
    </div>
  )
}
