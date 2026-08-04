import { initials } from '../lib/team'
import './teamcard.css'

/**
 * Card de miembro del equipo: retrato si existe, si no un avatar de
 * iniciales con gradiente. La usa la página /team.
 */
export default function TeamCard({ member }) {
  return (
    <div className="tcard">
      <div className="tcard_media">
        {member.photo ? (
          <img src={member.photo} alt={`Portrait of ${member.name}`} loading="lazy" />
        ) : (
          <div
            className="tcard_avatar"
            style={{ backgroundImage: `linear-gradient(140deg, ${member.grad[0]}, ${member.grad[1]})` }}
            aria-hidden="true"
          >
            <span>{initials(member.name)}</span>
          </div>
        )}
      </div>
      <h3 className="tcard_name">{member.name}</h3>
      <p className="tcard_role">{member.role}</p>
    </div>
  )
}
