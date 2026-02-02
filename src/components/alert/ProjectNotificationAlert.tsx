import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  AlertTriangle,
  Crown,
  Clock,
  UserPlus,
  Eye,
  Info,
  X,
} from 'lucide-react';

type AlertType = 'leadership_expired' | 'leadership_expiring' | 'no_leadership' | 'member_needed' | 'info';
type AlertSeverity = 'critical' | 'warning' | 'info';

interface ProjectNotificationAlertProps {
  type: AlertType;
  message: string;
  severity?: AlertSeverity;
  onViewDetails?: () => void;
  onAssignMember?: () => void;
  onDismiss?: () => void;
  metadata?: {
    position?: string;
    daysUntilExpiry?: number;
    expiryDate?: string;
  };
}

export function ProjectNotificationAlert({
  type,
  message,
  severity = 'warning',
  onViewDetails,
  onAssignMember,
  onDismiss,
  metadata,
}: ProjectNotificationAlertProps) {
  const getAlertStyles = () => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          icon: 'text-red-600',
          badge: 'bg-red-100 text-red-700 border-red-300',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-900',
          icon: 'text-orange-600',
          badge: 'bg-orange-100 text-orange-700 border-orange-300',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          icon: 'text-blue-600',
          badge: 'bg-blue-100 text-blue-700 border-blue-300',
        };
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'leadership_expired':
      case 'leadership_expiring':
        return <Crown className="w-5 h-5" />;
      case 'no_leadership':
        return <AlertTriangle className="w-5 h-5" />;
      case 'member_needed':
        return <UserPlus className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertTitle = () => {
    switch (type) {
      case 'leadership_expired':
        return 'Leadership Position Expired';
      case 'leadership_expiring':
        return 'Leadership Expiring Soon';
      case 'no_leadership':
        return 'No Leadership Assigned';
      case 'member_needed':
        return 'Additional Members Needed';
      case 'info':
        return 'Information';
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`flex items-start gap-3 p-4 ${styles.bg} border ${styles.border} rounded-lg`}>
      {/* Icon */}
      <div className={`shrink-0 ${styles.icon}`}>{getAlertIcon()}</div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className={`text-sm font-semibold ${styles.text} mb-1`}>{getAlertTitle()}</h4>
            {metadata?.position && (
              <Badge variant="outline" className={`${styles.badge} mb-2`}>
                <Crown className="w-3 h-3 mr-1" />
                {metadata.position}
              </Badge>
            )}
          </div>
          {onDismiss && (
            <button
              onClick={onDismiss}
              className={`shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <p className={`text-sm ${styles.text} mb-3`}>{message}</p>

        {/* Metadata */}
        {metadata?.daysUntilExpiry !== undefined && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <Clock className={`w-4 h-4 ${styles.icon}`} />
            <span className={styles.text}>
              {metadata.daysUntilExpiry === 0
                ? 'Expires today'
                : `${metadata.daysUntilExpiry} ${metadata.daysUntilExpiry === 1 ? 'day' : 'days'} remaining`}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onAssignMember && (
            <Button
              size="sm"
              onClick={onAssignMember}
              className="bg-[#009AF4] hover:bg-[#0086D6] text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign {metadata?.position || 'Member'}
            </Button>
          )}
          {onViewDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={onViewDetails}
              className={`border-${severity === 'critical' ? 'red' : severity === 'warning' ? 'orange' : 'blue'}-300 hover:bg-${severity === 'critical' ? 'red' : severity === 'warning' ? 'orange' : 'blue'}-100`}
            >
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for use in smaller spaces
export function CompactProjectAlert({
  type,
  message,
  severity = 'warning',
  onClick,
}: {
  type: AlertType;
  message: string;
  severity?: AlertSeverity;
  onClick?: () => void;
}) {
  const getAlertStyles = () => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-700',
          icon: 'text-red-600',
        };
      case 'warning':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-700',
          icon: 'text-orange-600',
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          icon: 'text-blue-600',
        };
    }
  };

  const getAlertIcon = () => {
    switch (type) {
      case 'leadership_expired':
      case 'leadership_expiring':
        return <Crown className="w-4 h-4" />;
      case 'no_leadership':
        return <AlertTriangle className="w-4 h-4" />;
      case 'member_needed':
        return <UserPlus className="w-4 h-4" />;
      case 'info':
        return <Info className="w-4 h-4" />;
    }
  };

  const styles = getAlertStyles();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 p-3 ${styles.bg} border ${styles.border} rounded-lg hover:opacity-80 transition-opacity text-left`}
    >
      <div className={`shrink-0 ${styles.icon}`}>{getAlertIcon()}</div>
      <p className={`text-sm ${styles.text} flex-1 min-w-0 truncate`}>{message}</p>
      {onClick && <Eye className={`w-4 h-4 ${styles.icon} shrink-0`} />}
    </button>
  );
}
