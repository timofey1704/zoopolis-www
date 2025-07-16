import Image from 'next/image'
import { getFAQs } from '@/lib/main/fetchFAQ'
import FAQ from '@/components/FAQ'
import Button from '@/components/ui/Button'
import Dog4 from '../public/dog4.png'
import Cat2 from '../public/cat2.png'
import Dog2 from '../public/god2.png'
import Cat1 from '../public/cat1.png'
import Dog3 from '../public/dog3.png'
import Brelok from '../public/brelok.png'
import MediaSlider from '@/components/MediaSlider'

export default async function Home() {
  const faqs = await getFAQs()

  return (
    <div className="mx-auto flex max-w-[1216px] flex-col items-center justify-center">
      <div className="my-8 flex items-center justify-center gap-10">
        <Image src={Dog2} alt="dog" width={289} height={263} />
        <div className="flex flex-col items-center justify-center space-y-5">
          <h2 className="text-white">
            <span className="text-black">ВАШ ПИТОМЕЦ</span>
            <span className="relative mx-2 inline-block px-1">
              <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
              <span className="relative text-white">ПОТЕРЯЛСЯ</span>
            </span>

            <br />
            <span className="mt-2 flex items-center justify-center text-black">ЧТО ДАЛЬШЕ?</span>
          </h2>
          <div className="text-center text-black">
            Бумажные жетоны теряются, информация устаревает. Номер на ошейнике не всегда виден или
            может быть неактуален. Ценные минуты тратятся впустую.
          </div>
        </div>
        <Image src={Cat1} alt="cat" width={289} height={263} />
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-24">
        <div className="relative grid grid-cols-1 items-center gap-6 sm:gap-8 md:grid-cols-2 md:gap-12">
          {/* плашка отзывов */}
          <div className="bg-gray/80 absolute top-1/2 left-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-[52px] px-6 py-3 shadow-lg backdrop-blur-sm sm:w-auto sm:px-8 sm:py-4 lg:px-10">
            <div className="flex flex-col items-center gap-2">
              <Image
                src="./reviewIcon.svg"
                alt="star"
                width={140}
                height={24}
                className="h-auto w-[100px] sm:w-[100px] lg:w-[140px]"
              />
              <span className="text-sm sm:text-base">Средняя оценка</span>
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8 md:space-y-11">
            <h2 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl md:text-4xl">
              Мы создали QR решения, которые помогают питомцам вернутся домой, а их хозяевам -
              оставаться спокойными.
            </h2>
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={Dog3}
                alt="dog"
                width={598}
                height={480}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={Brelok}
                alt="cat"
                width={400}
                height={330}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-base sm:text-lg">
                С 2020 года создаём QR-кулон для наших мохнатых друзей. Наша команда — ветеринары,
                разработчики и просто любители питомцев, понимающие, как важно быстро получить
                помощь в критический момент.
              </p>
              <p className="text-base sm:text-lg">
                Все данные защищены: серверы, шифрование и строгая конфиденциальность. Доступ к
                информации — только у тех, кому вы его открыли.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="my-8 flex flex-col items-center justify-center gap-10">
        <h2 className="text-white">
          <span className="text-black">МЫ НА</span>
          <span className="relative mx-2 inline-block px-1">
            <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
            <span className="relative text-white">МЕРОПРИЯТИЯХ</span>
          </span>
        </h2>
        <MediaSlider />
      </div>

      <FAQ faqs={faqs} />

      <div className="my-8 flex items-center justify-center gap-10">
        <Image src={Dog4} alt="dog" width={289} height={263} />
        <div className="flex flex-col items-center justify-center space-y-5">
          <h2 className="text-white">
            <span className="text-black">Не ждите беды.</span>
            <span className="relative mx-2 inline-block px-1">
              <span className="bg-orange absolute -inset-1 rotate-3 rounded-3xl" />
              <span className="relative text-white">Защитите</span>
            </span>
            <span className="text-black">того</span>
            <br />
            <span className="text-black">кто вас любит, прямо сейчас</span>
          </h2>
          <div className="text-center text-black">
            3 месяца Зоо ID-подписки в подарок при покупке QR-кулона!
          </div>
          <Button text="Защитить питомца" className="bg-orange text-white" />
        </div>
        <Image src={Cat2} alt="cat" width={289} height={263} />
      </div>
    </div>
  )
}
