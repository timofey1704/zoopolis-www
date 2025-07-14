import { getFAQs } from "@/lib/main/fetchFAQ"
import FAQ from "@/components/FAQ"

export default async function Home() {
const faqs = await getFAQs()

  return (
    <div>
      <FAQ faqs={faqs} />
    </div>
  );
}
