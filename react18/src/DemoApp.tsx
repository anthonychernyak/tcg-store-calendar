import React, { useRef } from 'react'
import {
  EventInput,
  EventApi,
  DateSelectInfo,
  EventClickInfo,
  EventDisplayInfo,
  CalendarRef,
} from '@fullcalendar/react'
import FullCalendar from '@fullcalendar/react'
import themePlugin from '@fullcalendar/react/themes/classic'
import dayGridPlugin from '@fullcalendar/react/daygrid'
import timeGridPlugin from '@fullcalendar/react/timegrid'
import interactionPlugin from '@fullcalendar/react/interaction'
import { INITIAL_EVENTS } from './event-utils'

import '@fullcalendar/react/skeleton.css'
import '@fullcalendar/react/themes/classic/theme.css'
import '@fullcalendar/react/themes/classic/palette.css'

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { GAMES, STORES } from './event-utils'
import { FormControl, InputLabel } from '@mui/material'

interface DemoAppState {
  weekendsVisible: boolean
  isModalOpen: boolean
  selectedEvent: EventInput,
  filterSelect: {
    stores: String[]
    games: String[]
  }
}

interface EventSelection {
  events: EventInput[]
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FILTER_OPTIONS = ["stores", "games"]

export default class DemoApp extends React.Component<{}, DemoAppState> {

  state: DemoAppState = {
    weekendsVisible: true,
    selectedEvent: INITIAL_EVENTS[0],
    isModalOpen: false,
    filterSelect: {
      stores: [],
      games: [],
    }
  }

  events: EventSelection = {
    events: [...INITIAL_EVENTS]
  }

  calendarRef = React.createRef<CalendarRef>();

  reloadCalendar = () => {
    const calendarApi = this.calendarRef.current.getApi();
    console.log(calendarApi)
    calendarApi.removeAllEvents();
    calendarApi.addEventSource(this.events.events)
  }

  renderValue = (value: String[]) => {
    return value.join(", ");
  }


  render() {

    return (
      <div className='demo-app'>
        {this.renderSidebar()}
        {this.renderModal()}
        <div className='demo-app-main'>
          <FullCalendar
            ref={this.calendarRef}
            plugins={[themePlugin, dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={false}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={this.events} // alternatively, use the `events` setting to fetch from a feed
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
          />
        </div>
      </div>
    )
  }

  renderModal() {
    return (
      <div className='modal-popup'>
        <div>
      <Modal
        open={this.state.isModalOpen}
        onClose={() => {}}
        onClick={() => {this.setState({isModalOpen: false})}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {this.state.selectedEvent.title}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, whiteSpace: "pre-line" }}>
            <b>Start Time:</b>  {this.state.selectedEvent.start.toString()}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, whiteSpace: "pre-line" }}>
            <b>Store:</b>  {this.state.selectedEvent.store.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, whiteSpace: "pre-line" }}>
            <b>Game:</b>  {this.state.selectedEvent.game.name}
          </Typography>
        </Box>
      </Modal>
    </div>
      </div>
    )
  }

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Filters</h2>
          <div>
            <h3>Store</h3>
            <FormControl fullWidth>
              <InputLabel id="Store Label">Store</InputLabel>
              <Select multiple renderValue={this.renderValue} defaultValue={[]} onChange={this.handleFilterChange}>
                {STORES.map((store) => (
                  <MenuItem key={store.name} value={{"name": store.name, "filterType": "stores"}}>
                  {store.name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div>
            <h3>Game</h3>
            <FormControl fullWidth>
              <InputLabel id="Game Label">Game</InputLabel>
              <Select multiple renderValue={this.renderValue} defaultValue={[]} onChange={this.handleFilterChange}>
                {GAMES.map((game) => (
                  <MenuItem key={game.name} value={{"name": game.name, "filterType": "games"}}>
                  {game.name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    )
  }

  handleFilterChange = (event: React.ChangeEvent<{value: unknown}>) => {
    let rawFilters = event.target.value as {name: string, filterType: string}[];
    let filterSelection = rawFilters.reduce((acc, { name, filterType }) => {
        (acc[filterType] ??= []).push(name);
        return acc;
      }, {} as Record<string, string[]>);
    FILTER_OPTIONS.forEach((filter) => {
      filterSelection[filter] ??= []
    })
    console.log(filterSelection)
    this.state.filterSelect = filterSelection
    this.applyFilter()
  }

  areFiltersCleared = () => {
    // TODO: Improve this to map automatically
    let totalLength = this.state.filterSelect.stores.length + this.state.filterSelect.games.length;
    return totalLength === 0;
  }

  applyFilter = () => {
    if (this.areFiltersCleared()) {
      this.events.events = INITIAL_EVENTS
    } else {
      let filteredEvents = INITIAL_EVENTS
      if(this.state.filterSelect.stores.length > 0) {
        filteredEvents = filteredEvents.filter((event) => { return this.state.filterSelect.stores.includes(event.store.name)})
      }
      if(this.state.filterSelect.games.length > 0) {
        filteredEvents = filteredEvents.filter((event) => { return this.state.filterSelect.games.includes(event.game.name)})
      }

      this.events.events = filteredEvents
      console.log(this.events.events)
    }

    this.reloadCalendar();
  }

  parseEvent = (clickInfo: EventClickInfo) => {
      let event = {
        title : clickInfo.event._def.title,
        start: clickInfo.event._instance.range.start,
        store: clickInfo.event._def.extendedProps.store,
        game: clickInfo.event._def.extendedProps.game
      }
      return event
  }

  handleEventClick = (clickInfo: EventClickInfo) => {
    console.log(clickInfo.event)
    let eventInfo = this.parseEvent(clickInfo)
    this.setState({
      isModalOpen: true,
      selectedEvent: eventInfo
    })
  }

}

function renderEventContent(info: EventDisplayInfo) {
  return (
    <>
      <b>{info.timeText}</b>
      <i>{info.event.title}</i>
    </>
  )
}
