import {
  CircleIcon,
  WindmillIcon,
  TypographyIcon,
  ShadowIcon,
  PaletteIcon,
  KeyIcon,
  BugIcon,
  DashboardIcon,
  BrandChromeIcon,
  HelpIcon,
  IdIcon,
  CameraPlusIcon, UserPlusIcon, CarIcon, FileReportIcon
} from 'vue-tabler-icons';


export interface menu {
  header?: string;
  title?: string;
  icon?: object;
  to?: string | { name: string };
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

let sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Default',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  { divider: true },
  { header: 'Pages' },
  {
    title: 'Gestión de administradores',
    icon: UserPlusIcon,
    to: { name: 'UserManagement' }
  },
  {
    title: 'Gestión de conductores',
    icon: IdIcon,
    to: { name: 'DriverManagement' }
  },
  {
    title: 'Gestión de camaras',
    icon: CameraPlusIcon,
    to: { name: 'CameraManagement' }
  },
  {
    title: 'Gestión de Unidades',
    icon: CarIcon,
    to: { name: 'UnitManagement' }
  },
  {
    title: 'Gestión de Reporte',
    icon: FileReportIcon,
    to: { name: 'ReportManagement' }
  },
  {
    title: 'Error 404',
    icon: BugIcon,
    to: '/pages/error'
  },
  { divider: true },
  { header: 'Utilities' },
  {
    title: 'Colors',
    icon: PaletteIcon,
    to: '/utils/colors'
  },

  {
    title: 'Icons',
    icon: WindmillIcon,
    to: '/forms/radio',
    children: [
      {
        title: 'Tabler Icons',
        icon: CircleIcon,
        to: '/icons/tabler'
      },
      {
        title: 'Material Icons',
        icon: CircleIcon,
        to: '/icons/material'
      }
    ]
  },
  { divider: true },


];

export default sidebarItem;
