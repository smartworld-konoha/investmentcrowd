import { environment } from './../../../../environments/environment';
import { ToastyService } from 'ng2-toasty';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sofort',
  templateUrl: './sofort.component.html',
  styleUrls: ['./sofort.component.scss']
})
export class SofortComponent implements OnInit {

  source: any;
  @Input() pledgedAmount: number;
  @Input() projectId: number;
  @Input() rewardId = null;

  constructor(
    private toastyService: ToastyService,
  ) {
    Stripe.setPublishableKey('pk_test_M2e5YbVJN53ZL7CWp1KdgNAC');
    // Stripe.setPublishableKey('pk_test_2EGWoFJPE26IJfFuipiFEV1M');
  }

  ngOnInit() {
  }

  createSourceObject() {
    this.source = Stripe.source.create({
      type: 'sofort',
      amount: this.pledgedAmount * 100,
      currency: 'eur',
      redirect: {
        return_url: this.redirectUrl(),
      },
      sofort: {
        country: 'DE',
        statement_descriptor: `PROJECT ${this.projectId}`,
      },
    }, this.stripeResponseHandler.bind(this));
  }

  private stripeResponseHandler(status: any) {
    if (status === 200) {
      const response = JSON.parse(this.source.response);
      const redirect_url = response.redirect.url;
      window.location.href = redirect_url;
    } else {
      const response = JSON.parse(this.source.response);
      const error_message = response.error.message;
      this.toastyService.error(error_message);
    }
  }

  redirectUrl() {
    if (this.rewardId) {
      return `${environment.UI_ENDPOINT}/projects/${this.projectId}/payment/sofort/redirect?reward=${this.rewardId}`;
    } else {
      return `${environment.UI_ENDPOINT}/projects/${this.projectId}/payment/sofort/redirect`;
    }
  }

}
