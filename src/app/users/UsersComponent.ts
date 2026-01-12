import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../users/user.model';
import { UserService } from '../services/user-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: '../users/users.html'
})
export class UserComponent implements OnInit {
  @Input() users: User[] = [];
  @Output() usersChanged = new EventEmitter<User[]>();

  // États
  showModal = false;
  modalMode: 'add' | 'edit' = 'add';
  selectedUser: User = this.getEmptyUser();
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  // Filtres
  searchTerm = '';
  selectedRole = 'all';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    if (this.users.length === 0) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
        this.usersChanged.emit(this.users);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        this.errorMessage = error.error?.message || 'Failed to load users';
      }
    });
  }

getEmptyUser(): User {
  return {
    id: undefined,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'USER'
  };
}


  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedUser = this.getEmptyUser();
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  openEditModal(user: User): void {
    this.modalMode = 'edit';

    this.selectedUser = { ...user };
    this.showModal = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

closeModal(): void {
  console.log('Closing modal, showModal was:', this.showModal);
  this.showModal = false;
  console.log('showModal after closing:', this.showModal);
  this.selectedUser = this.getEmptyUser();
  this.isSubmitting = false;
  this.errorMessage = '';
  this.successMessage = '';
}

onSubmit(): void {
  if (this.isSubmitting) return;

  this.isSubmitting = true;
  this.errorMessage = '';
  this.successMessage = '';

  if (this.modalMode === 'add') {
    this.userService.createUser(this.selectedUser).subscribe({
      next: (newUser: User) => {
        this.users.push(newUser);
        this.usersChanged.emit(this.users);
        this.successMessage = 'User created successfully!';

        // Fermer le modal après un court délai pour voir le message
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating user:', error);
        this.errorMessage = error.error?.message || 'Failed to create user';
        this.isSubmitting = false;
      }
    });
  } else {
    if (!this.selectedUser.id) {
      this.errorMessage = 'User ID is required for editing';
      this.isSubmitting = false;
      return;
    }

    this.userService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
      next: (updatedUser: User) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.usersChanged.emit(this.users);
        }
        this.successMessage = 'User updated successfully!';

        // Fermer le modal après un court délai pour voir le message
        setTimeout(() => {
          this.closeModal();
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error updating user:', error);
        this.errorMessage = error.error?.message || 'Failed to update user';
        this.isSubmitting = false;
      }
    });
  }
}

  deleteUser(user: User): void {
    if (!user.id || !confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
      return;
    }

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
        this.usersChanged.emit(this.users);
        this.successMessage = 'User deleted successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        this.errorMessage = error.error?.message || 'Failed to delete user';
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }

  // Filtrage
  get filteredUsers(): User[] {
    const search = this.searchTerm.toLowerCase();

    return this.users.filter(user => {
      const firstName = user.firstName?.toLowerCase() || '';
      const lastName  = user.lastName?.toLowerCase() || '';
      const email     = user.email?.toLowerCase() || '';

      const matchesSearch =
        firstName.includes(search) ||
        lastName.includes(search) ||
        email.includes(search);

      const matchesRole =
        this.selectedRole === 'all' || user.role === this.selectedRole;

      return matchesSearch && matchesRole;
    });
  }


  // Pagination
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Rôles disponibles
  get roles(): string[] {
    return ['ADMIN', 'USER', 'MODERATOR'];
  }
}
