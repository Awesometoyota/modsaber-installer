import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { shell } from '../../utils/electron'

import { IState } from '../../store'
import { IContainerState } from '../../store/container'
import { IJobsState } from '../../store/jobs'
import { installMods } from '../../store/mods'
import { IStatusState } from '../../store/status'
import { ITabsState, setCurrentTab, setMaxTabs } from '../../store/tabs'

import { Status } from '../../constants'

interface IProps {
  container: IContainerState
  jobs: IJobsState
  pirated: boolean
  disableInstall: boolean
  disableSelected: boolean
  status: IStatusState
  tabs: ITabsState

  installMods: typeof installMods
  setCurrentTab: typeof setCurrentTab
  setMaxTabs: typeof setMaxTabs
}

const handleModInfo = (props: IProps) => {
  const tab = props.tabs.current !== props.tabs.max ? props.tabs.max : 0

  if (props.container !== null) props.container.scrollTop = 0
  props.setCurrentTab(tab)
}

const BottomBar: FunctionComponent<IProps> = props => (
  <>
    <span className='status'>
      {props.status.type === Status.OFFLINE ? 'Error' : 'Status'}:{' '}
      {props.status.text}
    </span>

    <button
      className='button'
      disabled={props.disableSelected}
      onClick={() => handleModInfo(props)}
    >
      {props.tabs.current !== props.tabs.max
        ? 'View Selected Mod Info'
        : 'Go Back'}
    </button>

    {props.pirated ? (
      <button
        className='button'
        onClick={() => shell.openExternal('https://beatgames.com/')}
      >
        Buy the Game
      </button>
    ) : (
      <button
        className={`button${props.jobs.length > 0 ? ' is-loading' : ''}`}
        disabled={props.disableInstall}
        onClick={props.installMods}
      >
        Install / Update
      </button>
    )}
  </>
)

const mapStateToProps: (state: IState) => IProps = state => ({
  container: state.container,
  disableInstall:
    state.jobs.length > 0 ||
    state.status.type === Status.LOADING ||
    state.mods.list.length === 0,
  disableSelected: state.install.pirated || state.mods.selected === null,
  jobs: state.jobs,
  pirated: state.install.pirated,
  status: state.status,
  tabs: state.tabs,

  installMods,
  setCurrentTab,
  setMaxTabs,
})

export default connect(
  mapStateToProps,
  { installMods, setCurrentTab, setMaxTabs }
)(React.memo(BottomBar))
