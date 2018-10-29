import {
    Directive,
    Input,
    OnInit,
    TemplateRef,
    ViewContainerRef
  } from '@angular/core';
  
import { SecurityService } from '../services/security.service';

@Directive({ selector: '[appShowAuthed]' })
export class ShowAuthedDirective implements OnInit {
    constructor(
        private templateRef: TemplateRef<any>,
        private userService: SecurityService,
        private viewContainer: ViewContainerRef
    ) {}

    condition: boolean;

    ngOnInit() {
        this.userService.isAuthenticated.subscribe(
        (isAuthenticated) => {
            console.log(isAuthenticated);
            if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
            this.viewContainer.clear();
            }
        }
        );
    }

    @Input() set appShowAuthed(condition: boolean) {
        this.condition = condition;
    }

}