'use client';

import { ProposalStatus } from '@/types/proposal';

interface StatusBadgeProps {
  status: ProposalStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig = {
  [ProposalStatus.DRAFT]: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: '📝',
    description: 'Proposal is being created'
  },
  [ProposalStatus.REVIEW]: {
    label: 'In Review',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: '👀',
    description: 'Proposal is under review'
  },
  [ProposalStatus.READY_TO_SEND]: {
    label: 'Ready to Send',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: '✅',
    description: 'Proposal is ready to send'
  },
  [ProposalStatus.SENT]: {
    label: 'Sent',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: '📤',
    description: 'Proposal has been sent'
  }
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base'
};

export default function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = ''
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = sizeConfig[size];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full border font-medium
        ${config.color}
        ${sizeClasses}
        ${className}
      `}
      title={config.description}
    >
      {showIcon && <span className="text-sm">{config.icon}</span>}
      {config.label}
    </span>
  );
}

// Component for displaying status with timestamp
interface StatusBadgeWithTimestampProps extends StatusBadgeProps {
  timestamp?: string;
  showTimestamp?: boolean;
}

export function StatusBadgeWithTimestamp({ 
  status, 
  timestamp, 
  showTimestamp = true,
  ...props 
}: StatusBadgeWithTimestampProps) {
  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={status} {...props} />
      {showTimestamp && timestamp && (
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleDateString()}
        </span>
      )}
    </div>
  );
}

// Component for displaying status in a list
interface StatusBadgeListProps {
  statuses: Array<{
    status: ProposalStatus;
    timestamp?: string;
    notes?: string;
  }>;
  className?: string;
}

export function StatusBadgeList({ statuses, className = '' }: StatusBadgeListProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {statuses.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <StatusBadge status={item.status} size="sm" />
          {item.timestamp && (
            <span className="text-xs text-gray-500">
              {new Date(item.timestamp).toLocaleString()}
            </span>
          )}
          {item.notes && (
            <span className="text-xs text-gray-600 italic">
              {item.notes}
            </span>
          )}
        </div>
      ))}
    </div>
  );
} 