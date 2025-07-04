import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';

import { AuthComponent } from './auth.component';
import { AuthService } from '../../service/auth.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'register']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [AuthComponent],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ActivatedRoute, useValue: { fragment: of(null) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message when user is not found', () => {
    // Arrange
    const errorResponse = new Error('המשתמש לא קיים במערכת.');
    authService.login.and.returnValue(throwError(() => errorResponse));
    
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Act
    component.loginUser();

    // Assert
    expect(component.errorMessageLogin).toBe('המשתמש לא קיים במערכת.');
  });

  it('should clear error message when login dialog is closed', () => {
    // Arrange
    component.errorMessageLogin = 'Some error message';
    const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRef.afterClosed.and.returnValue(of(null));
    dialog.open.and.returnValue(dialogRef);

    // Act
    component.openLoginModal();

    // Assert
    expect(component.errorMessageLogin).toBe('');
  });
});
