import Link from "next/link";

export default function HomeLink({ sticky }: { sticky?: boolean }) {
	return <Link href="/" className="relative"><h1 className={`py-4 font-bold text-lg font-roc-grotesk w-fit ${sticky ? "lg:sticky" : ""} top-0 left-0 z-20`}>Yard Search</h1></Link>
}
