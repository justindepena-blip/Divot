import { useMemo, useState } from 'react'
import TabBar from './components/TabBar'
import { derive } from './lib/derive'
import { shotsFor } from './lib/round'
import Group from './screens/Group'
import Rangefinder from './screens/Rangefinder'
import Recap from './screens/Recap'
import Scorecard from './screens/Scorecard'
import Shots from './screens/Shots'
import CourseSheet from './sheets/CourseSheet'
import ShareSheet from './sheets/ShareSheet'
import { useCourseSearch } from './state/useCourseSearch'
import { useGeolocation } from './state/useGeolocation'
import { useRound } from './state/useRound'
import type { BoardMode, CardMode, Screen } from './types'

export default function App() {
  const round = useRound()
  const gps = useGeolocation()
  const search = useCourseSearch(round, gps.pos)

  const [screen, setScreen] = useState<Screen>('play')
  const [cardMode, setCardMode] = useState<CardMode>('tap')
  const [boardMode, setBoardMode] = useState<BoardMode>('gross')
  const [courseSheet, setCourseSheet] = useState(false)
  const [shareSheet, setShareSheet] = useState(false)

  const view = useMemo(() => derive(round.round, gps.pos), [round.round, gps.pos])
  const shots = useMemo(
    () => shotsFor(round.round, round.round.hole),
    [round.round],
  )

  return (
    <div className="app">
      <main className="app-scroll">
        {screen === 'play' && (
          <Rangefinder
            round={round}
            view={view}
            gps={gps}
            shots={shots}
            onOpenSheet={() => setCourseSheet(true)}
            onNavigate={setScreen}
          />
        )}
        {screen === 'shots' && <Shots round={round} view={view} gps={gps} shots={shots} />}
        {screen === 'card' && (
          <Scorecard
            round={round}
            view={view}
            mode={cardMode}
            onMode={setCardMode}
            onNavigate={setScreen}
          />
        )}
        {screen === 'summary' && (
          <Recap view={view} onNavigate={setScreen} onShare={() => setShareSheet(true)} />
        )}
        {screen === 'friends' && (
          <Group
            view={view}
            mode={boardMode}
            onMode={setBoardMode}
            onShare={() => setShareSheet(true)}
          />
        )}
      </main>

      <TabBar screen={screen} onNavigate={setScreen} />

      {courseSheet && (
        <CourseSheet
          round={round}
          search={search}
          pos={gps.pos}
          onClose={() => setCourseSheet(false)}
        />
      )}
      {shareSheet && <ShareSheet onClose={() => setShareSheet(false)} />}
    </div>
  )
}
