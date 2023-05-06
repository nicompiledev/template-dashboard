import { User } from './../models/register.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.css']
})
export class CreateRegistrationComponent implements OnInit {

  selectedGender!: string;
  tipoServicioSeleccionado!: string;
  genders: string[] = ["Male", "Female"];
  tipoServicios: string[] = ["Básico", "Premiun", "VIP"];
  packages: string[] = ["Monthly", "Quarterly", "Yearly"];
  paquetes: string[] = ["Mensual", "Trimestral", "Anual"];
  importantList: string[] = [
    "Toxic Fat reduction",
    "Energy and Endurance",
    "Building Lean Muscle",
    "Healthier Digestive System",
    "Sugar Craving Body",
    "Fitness"
  ];
  ofertaServicios: string[] = ["Lavado sencillo", "Lavado y aspirado", "Lavado, aspirado y encerado", "Lavado, aspirado, encerado y pulido", "Lavado, aspirado, encerado, pulido y tapicería"]

  registrationForm!: FormGroup;
  private userIdToUpdate!: number;
  public isUpdateActive: boolean = false;

  constructor(private fb: FormBuilder, private api: ApiService, private toastService: NgToastService, private activatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      nombreLavadero: [''],
      nombreResponsable: [''],
      apellidoResponsable: [''],
      telefono: [''],
      email: [''],
      direccion: [''],
      tipoServicio: [''],
      estado: [''],
      paquete: [''],
      oferta: [''],
      socioNuevo: [''],
      fechaActivacion: [''],


    });
    // this.registrationForm.controls['height'].valueChanges.subscribe(res => {
    //   this.calculateBmi(res);
    // });

    this.activatedRoute.params.subscribe(val => {
      this.userIdToUpdate = val['id'];
      if (this.userIdToUpdate) {
        this.isUpdateActive = true;
        this.api.getRegisteredUserId(this.userIdToUpdate)
          .subscribe({
            next: (res) => {
              this.fillFormToUpdate(res);
            },
            error: (err) => {
              console.log(err);
            }
          })
      }
    })
  }
  submit() {
    this.api.postRegistration(this.registrationForm.value)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'Registration Successful', duration: 3000 });
        this.registrationForm.reset();
      });
  }

  fillFormToUpdate(user: User) {
    this.registrationForm.setValue({
      nombreLavadero: user.nombreLavadero,
      nombreResponsable: user.nombreResponsable,
      apellidoResponsable: user.apellidoResponsable,
      telefono: user.telefono,
      email: user.email,
      direccion: user.direccion,
      tipoServicio: user.tipoServicio,
      estado: user.estado,
      paquete: user.paquete,
      oferta: user.oferta,
      socioNuevo: user.socioNuevo,
      fechaActivacion: user.fechaActivacion,

    })
  }

  update() {
    this.api.updateRegisterUser(this.registrationForm.value, this.userIdToUpdate)
      .subscribe(res => {
        this.toastService.success({ detail: 'SUCCESS', summary: 'User Details Updated Successful', duration: 3000 });
        this.router.navigate(['list']);
        this.registrationForm.reset();
      });
  }

  calculateBmi(value: number) {
    const weight = this.registrationForm.value.weight; // weight in kilograms
    const height = value; // height in meters
    const bmi = weight / (height * height);
    this.registrationForm.controls['bmi'].patchValue(bmi);
    switch (true) {
      case bmi < 18.5:
        this.registrationForm.controls['bmiResult'].patchValue("Underweight");
        break;
      case (bmi >= 18.5 && bmi < 25):
        this.registrationForm.controls['bmiResult'].patchValue("Normal");
        break;
      case (bmi >= 25 && bmi < 30):
        this.registrationForm.controls['bmiResult'].patchValue("Overweight");
        break;

      default:
        this.registrationForm.controls['bmiResult'].patchValue("Obese");
        break;
    }
  }

}
