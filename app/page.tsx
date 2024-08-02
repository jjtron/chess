import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4">
      <div className="text-2xl">Chess</div>
      <div className='p-2'>
        <div className="flex flex-row items-center md:px-28 p-6">
          <Link
            href="/machine"
            className="flex items-center gap-5 self-start w-32 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span className="w-full text-center" >Against the Machine</span>
          </Link>
          <div className="pl-2 leading-none" >Play against an Artificially Intelligent entity.</div>
        </div>
        <div className="flex flex-row items-center md:px-28 p-6">
          <Link
            href="/dual"
            className="flex items-center gap-5 self-start w-32 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span className="w-full text-center" >Against a Human</span>
          </Link>
          <div className="pl-2 leading-none" >Play against a remotely located opponent.</div>
        </div>
        <div className="flex flex-row items-center md:px-28 p-6">
          <Link
            href="/self"
            className="flex items-center gap-5 self-start w-32 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
          >
            <span className="w-full text-center" >Against Yourself</span>
          </Link>
          <div className="pl-2 leading-none" >Play against your invincible self.</div>
        </div>
      </div>
    </main>
  );
}
