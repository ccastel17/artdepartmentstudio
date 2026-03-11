import Image from 'next/image';
import { Linkedin, ExternalLink } from 'lucide-react';
import { TeamMember } from '@/types';

// Mock data - Replace with actual database queries
const partners: TeamMember[] = [
  {
    id: '1',
    name: 'Agustina Santinelli',
    role: 'Sculptor',
    image: '/team/agustina.jpg',
    portfolio: 'https://agustinasantinelli.com',
    linkedin: 'https://linkedin.com/in/agustinasantinelli',
    isPartner: true,
  },
  {
    id: '2',
    name: 'Xim Barrasa',
    role: 'Sculptor',
    image: '/team/xim.jpg',
    portfolio: 'https://ximbarrasa.com',
    linkedin: 'https://linkedin.com/in/ximbarrasa',
    isPartner: true,
  },
  {
    id: '3',
    name: 'Carlos Castel',
    role: 'Photographer',
    image: '/team/carlos.jpg',
    portfolio: 'https://carloscastel.com',
    linkedin: 'https://linkedin.com/in/carloscastel',
    isPartner: true,
  },
];

const collaborators: TeamMember[] = [
  // Add collaborators here
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-32">
        <h1 className="text-white mb-12">
          About Us
        </h1>
        <div className="max-w-4xl space-y-8">
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            Art Department Studio is a scenographic materials production and product photography 
            studio with over 10 years of experience in the audiovisual industry.
          </p>
          <p className="text-xl md:text-2xl text-gray-400 leading-relaxed">
            Located in our workshop in Hospitalet de Llobregat, we manufacture materials 
            for filming and produce projects that include on-site or workshop scenographic production, 
            photo shoots, art direction for filming, and crew assembly for events, festivals, and sets.
          </p>
        </div>
      </div>

      {/* Partners */}
      <div className="mb-32">
        <h2 className="text-white mb-16">
          Founding Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {partners.map((partner) => (
            <div key={partner.id} className="group">
              <div className="relative aspect-square mb-6 overflow-hidden bg-white/5">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {partner.name}
              </h3>
              <p className="text-lg text-gray-400 mb-4">
                {partner.role}
              </p>
              <div className="flex gap-4">
                {partner.portfolio && (
                  <a
                    href={partner.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`Portfolio de ${partner.name}`}
                  >
                    <ExternalLink size={24} />
                  </a>
                )}
                {partner.linkedin && (
                  <a
                    href={partner.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label={`LinkedIn de ${partner.name}`}
                  >
                    <Linkedin size={24} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collaborators */}
      {collaborators.length > 0 && (
        <div>
          <h2 className="text-white mb-16">
            Collaborators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {collaborators.map((collaborator) => (
              <div key={collaborator.id} className="group">
                <div className="relative aspect-square mb-4 overflow-hidden bg-white/5">
                  <Image
                    src={collaborator.image}
                    alt={collaborator.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <h4 className="text-base font-bold text-white mb-1">
                  {collaborator.name}
                </h4>
                <p className="text-sm text-gray-400 mb-3">
                  {collaborator.role}
                </p>
                <div className="flex gap-3">
                  {collaborator.portfolio && (
                    <a
                      href={collaborator.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`Portfolio de ${collaborator.name}`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  {collaborator.linkedin && (
                    <a
                      href={collaborator.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={`LinkedIn de ${collaborator.name}`}
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
