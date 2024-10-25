import { BugIcon, DashboardIcon, IdIcon, CameraPlusIcon, UserPlusIcon, CarIcon, FileReportIcon } from 'vue-tabler-icons';

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
  { divider: true }
];

export default sidebarItem;
