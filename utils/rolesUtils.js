// utils/rolesUtils.js

const Roles = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  GUARD: 'Guard',
};

const rolePermissions = {
  Admin: [
    'createUser',
    'viewAllUsers',
    'assignRole',
    'viewAttendance',
    'viewTasks',
  ],
  Teacher: ['markAttendance', 'assignTasks', 'viewStudents'],
  Student: ['viewTasks', 'markAttendance'],
  Guard: ['scanQR', 'updateEntryExit'],
};

// Utility function to check if a role has a specific permission
function hasPermission(role, permission) {
  return rolePermissions[role]?.includes(permission);
}

module.exports = {
  Roles,
  rolePermissions,
  hasPermission,
};
