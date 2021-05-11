import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ProfileDetailsService} from '@app/_services/api/accounts/profile-details.service';
import {MessageService} from '@app/_services/message.service';
import {ConsentService} from '@app/_services/api/accounts/consent.service';
import {MESSAGE_TYPES, User} from '@app/_models';
import {Router} from '@angular/router';

@Component({
    selector: 'app-profile-details',
    templateUrl: './profile-details.component.html',
    styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
    formData: FormGroup;
    userConsent: boolean;
    userDetails: User;

    constructor(private router: Router,
                private builder: FormBuilder,
                private profile: ProfileDetailsService,
                private messageService: MessageService,
                private consentService: ConsentService) {
    }

    ngOnInit(): void {
        this.formData = this.builder.group({
            first_name: new FormControl('', [Validators.required]),
            last_name: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email])
        });

        this.consentService.getConsent().subscribe(consents => {
            this.userConsent = consents[consents.length - 1].consent;
        });
        this.profile.GetProfileDetails().subscribe((details: User) => {
            this.userDetails = details;
            this.formData.controls.first_name.setValue(this.userDetails[0].first_name);
            this.formData.controls.last_name.setValue(this.userDetails[0].last_name);
            this.formData.controls.email.setValue(this.userDetails[0].email);
        });
    }

    onSubmit(formData: FormGroup): void {
        this.profile.PutProfileDetails(formData.value, this.userDetails[0].id)
            .subscribe(() => {
                this.messageService.add(MESSAGE_TYPES.SUCCESS, 'Your profile has been updated successfully!');
            }, error => {
                console.warn(error.responseText);
                this.messageService.add(MESSAGE_TYPES.DANGER, error.responseText);
            });
    }

    withdraw(): void {
        this.consentService.postConsent({
            consent: false,
            legal_first_name: '',
            legal_last_name: '',
            student_number: '',
            date: ''
        }).subscribe(() => {
            this.messageService.add(MESSAGE_TYPES.SUCCESS, 'Your consent has been withdrawn successfully!');
        }, error => {
            console.warn(error.responseText);
            this.messageService.add(MESSAGE_TYPES.DANGER, error.responseText);
        });
        this.userConsent = false;
    }
}