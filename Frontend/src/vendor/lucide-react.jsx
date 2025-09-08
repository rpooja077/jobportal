import React from "react";

function createIcon(name) {
  return function Icon(props) {
    const { className = "", style = {}, ...rest } = props;
    return (
      <span
        aria-hidden="true"
        title={name}
        className={className}
        style={{ display: "inline-block", width: 16, height: 16, background: "transparent", ...style }}
        {...rest }
      />
    );
  };
}

export const X = createIcon("X");
export const Check = createIcon("Check");
export const ChevronDown = createIcon("ChevronDown");
export const ChevronUp = createIcon("ChevronUp");
export const ArrowLeft = createIcon("ArrowLeft");
export const ArrowRight = createIcon("ArrowRight");
export const Contact = createIcon("Contact");
export const Mail = createIcon("Mail");
export const Pen = createIcon("Pen");
export const Download = createIcon("Download");
export const Loader2 = createIcon("Loader2");
export const Edit2 = createIcon("Edit2");
export const MoreHorizontal = createIcon("MoreHorizontal");
export const Eye = createIcon("Eye");
export const Bookmark = createIcon("Bookmark");
export const BookMarked = createIcon("BookMarked");
export const Circle = createIcon("Circle");
export const Search = createIcon("Search");
export const FileText = createIcon("FileText");
export const Users = createIcon("Users");
export const Calendar = createIcon("Calendar");
export const Building2 = createIcon("Building2");
export const Briefcase = createIcon("Briefcase");
export const Code = createIcon("Code");
export const Database = createIcon("Database");
export const Cpu = createIcon("Cpu");
export const Brain = createIcon("Brain");
export const Shield = createIcon("Shield");
export const Palette = createIcon("Palette");
export const Video = createIcon("Video");
export const MapPin = createIcon("MapPin");
export const DollarSign = createIcon("DollarSign");
export const Clock = createIcon("Clock");
export const Award = createIcon("Award");

export default {
  X,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Contact,
  Mail,
  Pen,
  Download,
  Loader2,
  Edit2,
  MoreHorizontal,
  Eye,
  Bookmark,
  BookMarked,
  Circle,
  Search,
  FileText,
  Users,
  Calendar,
  Building2,
  Briefcase,
  Code,
  Database,
  Cpu,
  Brain,
  Shield,
  Palette,
  Video,
  MapPin,
  DollarSign,
  Clock,
  Award,
};
