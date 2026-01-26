import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-moss bg-forest-950 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-sm leading-relaxed text-sage">
          <strong className="text-cream">Disclaimer:</strong> The information
          provided on this site is for educational purposes only and is not
          intended as medical advice. Always consult with a qualified healthcare
          provider before using any herbal remedies, especially if you are
          pregnant, nursing, taking medications, or have a medical condition.
          Herbs can interact with medications and may not be appropriate for
          everyone.
        </p>
        <p className="mt-6 text-center text-sm text-sage">
          &copy; {new Date().getFullYear()} El Woods Apothecary &bull; Part of
          the{' '}
          <Link href="/" className="text-gold hover:text-gold-400">
            El Woods
          </Link>{' '}
          family
        </p>
      </div>
    </footer>
  );
}
