import './StatusBadge.css';

interface StatusBadgeProps {
    status: 'open' | 'in_progress' | 'closed';
    variant?: 'default' | 'small';
}

function StatusBadge({status, variant = 'default'}: StatusBadgeProps) {
    const getStatusLabel = (status: string) => {
        //prevodi tehničke statuse u čitljive tekstove

        switch (status) {
            case 'open': return 'Open';
            case 'in_progress': return 'In progress';
            case 'closed': return 'Closed';
            default: return status;
        }
    };

    return (
        <span className={`status-badge status-badge-${status} status-badge-${variant}`}>
            {getStatusLabel(status)}
        </span>
    );
}

export default StatusBadge;