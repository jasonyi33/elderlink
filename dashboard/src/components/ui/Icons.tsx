/**
 * Professional Icon Library using Lucide React
 * Replaces emoji icons with professional SVG icons
 */

import {
  Heart,
  Activity,
  Phone,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Building2,
  Bot,
  User,
  Calendar,
  Pill,
  RefreshCw,
  Expand,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Link,
  Check,
  X,
  Menu,
  Settings,
  LogOut,
  BarChart3,
  MessageSquare,
  UserCircle2,
  HeartPulse,
  Stethoscope,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Search,
  Filter,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  type LucideIcon,
} from 'lucide-react';

export const Icons = {
  // Health & Medical
  heart: Heart,
  activity: Activity,
  heartPulse: HeartPulse,
  stethoscope: Stethoscope,
  pill: Pill,
  hospital: Building2,

  // Communication
  phone: Phone,
  message: MessageSquare,
  bot: Bot,

  // People
  user: User,
  userCircle: UserCircle2,
  users: Users,

  // Status & Feedback
  check: CheckCircle,
  checkmark: Check,
  alert: AlertTriangle,
  close: X,

  // Navigation
  menu: Menu,
  chevronDown: ChevronDown,
  chevronUp: ChevronUp,
  chevronRight: ChevronRight,

  // Data & Analytics
  trending: TrendingUp,
  chart: BarChart3,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,

  // Actions
  refresh: RefreshCw,
  expand: Expand,
  externalLink: ExternalLink,
  link: Link,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  share: Share2,
  more: MoreHorizontal,

  // Time
  clock: Clock,
  calendar: Calendar,

  // Settings
  settings: Settings,
  logout: LogOut,
} as const;

export type IconName = keyof typeof Icons;

// Icon component wrapper for consistent styling
interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

export function Icon({ name, className = '', size = 20 }: IconProps) {
  const IconComponent = Icons[name];
  return <IconComponent className={className} size={size} />;
}

export default Icons;
