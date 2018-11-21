import React, { Component } from 'react';
import * as api from '../../Api';
import Meme from '../meme/Meme';

import './New.css';

class New extends Component {
    state = {
        templates: []
    };

    componentDidMount() {
        this.fetchTemplates(this.props.category);
    }

    componentDidUpdate(previousProps) {
        if (this.props.category !== previousProps.category) {
            this.fetchTemplates(this.props.category);
        }
    }

    fetchTemplates(category) {
        api.fetchTemplates(category)
            .then(templates => this.setState({ templates }));
    }

    changeTemplate(template) {
        this.setState({
            preview: { ...this.state.preview, template }
        })
    }

    changeTop(top) {
        this.setState({
            preview: { ...this.state.preview, top }
        })
    }

    changeBottom(bottom) {
        this.setState({
            preview: { ...this.state.preview, bottom }
        });
    }

    save() {
        api.saveMeme(
            this.props.category,
            this.state.preview.template,
            this.state.preview.top,
            this.state.preview.bottom)
            .then(() => this.props.reloadMemes());
    }

    render() {
        return (
            <form className="new">
                <select placeholder="Template"
                    required
                    onChange={(e) => this.changeTemplate(e.target.value)}>
                    {this.state.templates.map((template, index) => <option key={index} value={template.fullPath}>{template.fileName}</option>)}
                </select>

                <input type="text" placeholder="Top" required onChange={(e) => this.changeTop(e.target.value)} />

                <input type="text" placeholder="Bottom" required onChange={(e) => this.changeBottom(e.target.value)} />

                {this.state.preview && <Meme meme={this.state.preview} update={new Date()}></Meme>}

                <div className="buttons">
                    <div>
                        <a href="/">Cancel</a>
                    </div>
                    <div>
                        <button type="button" onClick={() => this.save()}>Save</button>
                    </div>
                </div >
            </form >
        );
    }
}

export default New;

/*
<form [formGroup]="form">
    <mat-form-field>
        <mat-select placeholder="Template" formControlName="template" required>
            <mat-option>--</mat-option>
            <mat-option *ngFor="let template of templates" [value]="template">
                {{template.fileName}}
            </mat-option>
        </mat-select>
    </mat-form-field>

    <mat-form-field>
        <input type="text" matInput placeholder="Top" formControlName="top" required />
    </mat-form-field>

    <mat-form-field>
        <input type="text" matInput placeholder="Bottom" formControlName="bottom" required />
    </mat-form-field>

    <app-meme *ngIf="preview" [meme]="preview"></app-meme>

    <div class="button-row">
        <a mat-button routerLink="/">Cancel</a>
        <button mat-button color="primary" (click)="save()">Save</button>
    </div>
</form>
 */