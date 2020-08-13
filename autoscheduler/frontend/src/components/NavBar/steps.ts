import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import ListIcon from '@material-ui/icons/List';
import ClockIcon from '@material-ui/icons/Schedule';
import SwapIcon from '@material-ui/icons/SwapHoriz';
import DoneIcon from '@material-ui/icons/Done';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';

export interface StepData {
    label: string;
    link: string;
    icon: OverridableComponent<SvgIconTypeMap>;
  }

const steps: StepData[] = [
  {
    label: 'Select courses',
    link: '/select-courses',
    icon: ListIcon,
  },
  {
    label: 'Select times',
    link: '/select-times',
    icon: ClockIcon,

  },
  {
    label: 'Fetch schedules',
    link: '/schedules',
    icon: ClockIcon,
  },
  {
    label: 'Customize',
    link: '/customize-schedule',
    icon: SwapIcon,
  },
  {
    label: 'Show CRN\'s',
    link: '/show-crn',
    icon: DoneIcon,
  },
];

export default steps;
