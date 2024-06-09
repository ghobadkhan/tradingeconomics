import { Component, ElementRef, QueryList, ViewChildren, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DemoChartComponent } from '../demo-chart/demo-chart.component';
import { IResponse, IDictionary, IData } from '../contracts';

 
@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, DemoChartComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {
  @ViewChildren('option') options!: QueryList<ElementRef>
  optionControls: IDictionary<FormControl> = {}
  protected allowedCountries = ["mexico", "new zealand", "sweden", "thailand"]

  protected optionsChecked:number = 0
  protected chartData!: Array<IData> | undefined
  
  country1 = new FormControl('mexico',[
    Validators.required,
    Validators.minLength(3),
    this.countryValidator()
  ])
  country2 = new FormControl('sweden',[
    Validators.required,
    Validators.minLength(3),
    this.countryValidator()
  ])
  error: string = ""
  indicatorList: Array<{name:string, id:number}> = [
    {name:'gdp', id:1},
    {name:'population', id:2},
    {name:'money', id:3}, 
    {name:'productivity', id:4},
    {name:'private investment', id:5},
  ]
  constructor(private client:HttpClient) {}
  ngOnInit(): void {
    this.indicatorList.forEach(item => {
      this.optionControls[item.name] = new FormControl(false)
    })
  }
  countryValidator(): ValidatorFn {
    return (control:AbstractControl): ValidationErrors | null => {
      let error = !this.allowedCountries.includes(control.value.toLowerCase())
      return error ? {allowedCountries: {value: this.allowedCountries}} : null
    }
  }
  onOptionChange(input: EventTarget) {
    this.error = "";
    (input as HTMLInputElement).checked ? this.optionsChecked++ : this.optionsChecked--
    
    this.options.forEach(o => {
      if (!o.nativeElement.checked) {
        o.nativeElement.disabled = !(this.optionsChecked < 2)
      }
    })
  }
  onSubmit() {
    if (this.optionsChecked < 1) {
      this.error = "Please select at least one indicator!"
      } else {
        let indicators = this.prepareIndicators()
        let body = {
          indicators:indicators,
          country1: this.country1.value?.toLowerCase(),
          country2: this.country2.value?.toLowerCase()
      }
      this.client.post("/api/compare",body).subscribe({
        next: response => this.chartData = (response as IResponse).data,
        error: err => this.error = err["errors"]
      })

    }
  }
  onClear() {
    this.chartData = undefined
  }
  prepareIndicators() {
    let indicators = []
    for (let key in this.optionControls) {
      if (this.optionControls[key].value) {
        indicators.push(key)
      }
    }
    return indicators
  }

}
