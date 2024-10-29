import { DashboardIcon, CameraPlusIcon, UserPlusIcon, CarIcon, FileReportIcon } from 'vue-tabler-icons';

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

const sidebarItem: menu[] = [
  { header: 'Panel' },
  {
    title: 'Inicio',
    icon: DashboardIcon,
    to: '/dashboard/default'
  },
  { divider: true },
  { header: 'Gestión' },
  {
    title: 'Gestión de usuarios',
    icon: UserPlusIcon,
    to: { name: 'UserManagement' }
  },
  {
    title: 'Gestión de cámaras',
    icon: CameraPlusIcon,
    to: { name: 'CameraManagement' }
  },
  {
    title: 'Gestión de unidades',
    icon: CarIcon,
    to: { name: 'UnitManagement' }
  },
  {
    title: 'Gestión de reportes',
    icon: FileReportIcon,
    to: { name: 'ReportManagement' }
  },
  { divider: true }
];

export default sidebarItem;
