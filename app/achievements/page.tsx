import type { Metadata } from 'next'
import { AchievementsPage } from '@/components/navin-portfolio'

export const metadata: Metadata = { title: 'Achievements — Navin Kawal', description: 'A gallery of Navin Kawal’s milestones, certifications and contribution.' }
export default function Page() { return <AchievementsPage /> }
