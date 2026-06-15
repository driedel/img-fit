import './setup.js';
import 'zone.js';
import 'reflect-metadata';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Component, NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { ImgFitDirective } from '../dist/index.js';

TestBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

@Component({
  selector: 'app-test',
  template: '<img [imgFit]="src" alt="Photo">'
})
class TestComponent {
  src = 'https://cdn.example.com/photo.jpg';
}

@NgModule({
  declarations: [ImgFitDirective, TestComponent]
})
class TestModule {}

describe('ImgFit Angular directive', () => {
  it('renders an img with data-img-fit attribute', async () => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    });

    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const img = fixture.nativeElement.querySelector('img');
    assert.ok(img);
    assert.equal(img.getAttribute('data-img-fit'), 'https://cdn.example.com/photo.jpg');
    assert.equal(img.alt, 'Photo');
  });
});
