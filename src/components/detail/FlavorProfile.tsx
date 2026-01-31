import { cn } from '@/lib/utils';
import { Pill } from '@/components/ui/Pill';
import type { TeaProfile } from '@/types';

interface FlavorProfileProps {
  profile: TeaProfile;
  className?: string;
}

export function FlavorProfile({ profile, className }: FlavorProfileProps) {
  return (
    <div className={cn('space-y-6', className)}>
      {/* Aroma & Flavor pill clouds */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Aroma
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.aroma.map((note) => (
              <Pill key={note} variant="default">{note}</Pill>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Flavor
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {profile.flavor.map((note) => (
              <Pill key={note} variant="default">{note}</Pill>
            ))}
          </div>
        </div>
      </div>

      {/* Detail cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Appearance
          </span>
          <span className="mt-1.5 block text-sm text-gray-300">{profile.appearance}</span>
        </div>
        <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
          <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
            Liquor Color
          </span>
          <span className="mt-1.5 block text-sm text-gray-300">{profile.liquorColor}</span>
        </div>
        {profile.mouthfeel && (
          <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Mouthfeel
            </span>
            <span className="mt-1.5 block text-sm text-gray-300">{profile.mouthfeel}</span>
          </div>
        )}
        {profile.finish && (
          <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-gray-500">
              Finish
            </span>
            <span className="mt-1.5 block text-sm text-gray-300">{profile.finish}</span>
          </div>
        )}
      </div>
    </div>
  );
}
