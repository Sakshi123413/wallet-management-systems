import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  Key,
  RefreshCw,
} from 'lucide-react';
import CommonButton from '../../components/common/CommonButton';
import CommonCard from '../../components/common/CommonCard';
import GroupFormModal from '../../components/groups/GroupFormModal';
import GroupDeleteModal from '../../components/groups/GroupDeleteModal';
import TableSkeleton from '../../components/users/TableSkeleton';
import { getGroups, getPermissions } from '../../services/api';
import { showSuccess, showError } from '../../components/common/Toast';

const GroupsManagement = () => {
  const [groups, setGroups] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [groupsPerPage] = useState(10);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [groupsData, permissionsData] = await Promise.all([
        getGroups(),
        getPermissions(),
      ]);
      setGroups(groupsData);
      setPermissions(permissionsData);
    } catch (error) {
      const message = error?.message || error?.error || 'Failed to fetch data';
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    fetchData();
  };

  const handleDeleteSuccess = () => {
    fetchData();
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setIsFormModalOpen(true);
  };

  const openDeleteModal = (group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedGroup(null);
    setIsFormModalOpen(true);
  };

  const closeModal = () => {
    setIsFormModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedGroup(null);
  };

  // Filter groups based on search
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.permissions?.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination logic
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = filteredGroups.slice(indexOfFirstGroup, indexOfLastGroup);
  const totalPages = Math.ceil(filteredGroups.length / groupsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPermissionColor = (permissionName) => {
    const colors = {
      READ: 'bg-blue-100 text-blue-800 border-blue-300',
      WRITE: 'bg-green-100 text-green-800 border-green-300',
      DELETE: 'bg-red-100 text-red-800 border-red-300',
      ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    };
    return colors[permissionName] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getGroupIcon = (groupName) => {
    if (groupName.includes('ADMIN')) return '👑';
    if (groupName.includes('MANAGER')) return '👔';
    if (groupName.includes('USER')) return '👤';
    return '🛡️';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-2 rounded-xl">
              <Shield className="w-7 h-7 text-white" />
            </div>
            Groups Management
          </h1>
          <p className="text-gray-600 mt-1">Manage roles and access permissions</p>
        </div>

        <div className="flex items-center gap-3">
          <CommonButton onClick={fetchData} variant="secondary" icon={RefreshCw}>
            Refresh
          </CommonButton>
          <CommonButton onClick={openAddModal} variant="primary" icon={Plus}>
            Add Group
          </CommonButton>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Groups</p>
              <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Permissions</p>
              <p className="text-2xl font-bold text-gray-900">{permissions.length}</p>
            </div>
          </div>
        </CommonCard>

        <CommonCard>
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Permissions</p>
              <p className="text-2xl font-bold text-gray-900">
                {permissions.map((p) => p.name).join(', ')}
              </p>
            </div>
          </div>
        </CommonCard>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <CommonCard>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by group name or permission..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
            />
          </div>
        </CommonCard>
      </motion.div>

      {/* Groups Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <CommonCard>
          {loading ? (
            <TableSkeleton rows={5} columns={4} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Group
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Permissions
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Group ID
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredGroups.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center">
                          <div className="text-gray-400">
                            <Shield className="w-12 h-12 mx-auto mb-3" />
                            <p className="text-lg font-medium">No groups found</p>
                            <p className="text-sm">
                              {searchTerm
                                ? 'Try adjusting your search'
                                : 'Add your first group to get started'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentGroups.map((group, index) => (
                        <motion.tr
                          key={group.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="text-2xl">
                                {getGroupIcon(group.name)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{group.name}</p>
                                <p className="text-xs text-gray-500">
                                  {group.permissions?.length || 0} permissions
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              {group.permissions?.map((perm, idx) => (
                                <span
                                  key={idx}
                                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPermissionColor(
                                    perm
                                  )}`}
                                >
                                  {perm}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500 font-mono">#{group.id}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEditModal(group)}
                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                                title="Edit Group"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openDeleteModal(group)}
                                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                title="Delete Group"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredGroups.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Showing {indexOfFirstGroup + 1} to{' '}
                    {Math.min(indexOfLastGroup, filteredGroups.length)} of{' '}
                    {filteredGroups.length} groups
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? 'bg-purple-600 text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </CommonCard>
      </motion.div>

      {/* Modals */}
      <GroupFormModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        group={selectedGroup}
        permissions={permissions}
        onSuccess={handleFormSuccess}
      />

      <GroupDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        group={selectedGroup}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default GroupsManagement;
