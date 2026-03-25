'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Linkedin, X } from 'lucide-react';
import { TeamMember } from '@/types';

interface AboutUsTeamMembersClientProps {
  members: TeamMember[];
}

export default function AboutUsTeamMembersClient({ members }: AboutUsTeamMembersClientProps) {
  const [activeMember, setActiveMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMember(null);
      }
    };

    if (activeMember) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [activeMember]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {members.map((member) => (
          <div key={member.id} className="group">
            <div className="relative aspect-square mb-6 overflow-hidden bg-white/5">
              {member.imageUrl || member.image ? (
                <Image
                  src={member.imageUrl || member.image || ''}
                  alt={member.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              ) : (
                <div className="absolute inset-0" />
              )}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{member.name}</h3>
            <p className="text-lg text-gray-400 mb-4">{member.role}</p>

            <button
              type="button"
              onClick={() => setActiveMember(member)}
              className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4 mb-6"
            >
              Read Bio
            </button>

            <div className="flex gap-4">
              {member.portfolio && (
                <a
                  href={member.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Portfolio de ${member.name}`}
                >
                  <ExternalLink size={24} />
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <Linkedin size={24} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 md:px-6 py-4"
          onClick={() => setActiveMember(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Bio de ${activeMember.name}`}
        >
          <div
            className="w-full max-w-2xl bg-black border-[3px] border-white p-4 md:p-8 max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 md:gap-6 mb-6 flex-shrink-0">
              <div className="min-w-0">
                <h3 className="text-white text-xl md:text-2xl font-bold mb-1 break-words">{activeMember.name}</h3>
                <p className="text-gray-400 text-sm md:text-base">{activeMember.role}</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMember(null)}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line overflow-hidden">
              {activeMember.bio}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
