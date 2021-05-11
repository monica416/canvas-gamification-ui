import {Category, Question} from '@app/_models';


export interface UQJ {
    id: number;
    random_seed: number;
    last_viewed: Date;
    opened_tutorial: boolean;
    tokens_received: number;
    is_solved: boolean;
    is_partially_solved: boolean;
    format: string;
    category: Category;
    subcategory: string;
    status: string;
    question: Question;
    num_attempts: number;
    formatted_current_tokens_received: string;
    is_allowed_to_submit: boolean;
    variables: any;
    variables_errors: [];
    rendered_text: string;
    rendered_choices: {};
    rendered_lines: [];
    status_class: string;
    input_files: [];
}