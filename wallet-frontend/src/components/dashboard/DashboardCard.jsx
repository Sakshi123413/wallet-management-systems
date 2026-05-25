import PropTypes from 'prop-types';

export default function DashboardCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
}

DashboardCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
