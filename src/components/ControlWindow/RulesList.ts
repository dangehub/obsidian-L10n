import { TranslationRule } from '../../types/TranslationRule';

export class RulesList {
    private rulesContainer: HTMLElement;

    constructor(
        private container: HTMLElement,
        private onDeleteRule: (ruleKey: string) => void
    ) {
        this.createRulesList();
    }

    private createRulesList() {
        const rulesContainer = this.container.createDiv();
        rulesContainer.classList.add('rules-container');
        rulesContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 4px;
        `;

        this.rulesContainer = rulesContainer;
    }

    updateRules(rules: TranslationRule[], searchTerm: string = '') {
        this.rulesContainer.empty();
        
        const filteredRules = rules.filter(rule => {
            const matchesSearch = searchTerm === '' || 
                rule.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rule.translatedText.toLowerCase().includes(searchTerm.toLowerCase());
            
            return matchesSearch;
        });
        
        filteredRules.forEach(rule => {
            const ruleItem = this.createRuleItem(rule);
            this.rulesContainer.appendChild(ruleItem);
        });
        
        if (filteredRules.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'translation-rules-empty';
            emptyMessage.textContent = '没有找到匹配的规则';
            this.rulesContainer.appendChild(emptyMessage);
        }
    }

    private createRuleItem(rule: TranslationRule): HTMLElement {
        const ruleItem = document.createElement('div');
        ruleItem.classList.add('rule-item');
        ruleItem.style.cssText = `
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid var(--background-modifier-border);
            border-radius: 4px;
            background: var(--background-primary);
        `;

        // 创建规则内容
        const content = ruleItem.createDiv({
            cls: 'rule-content'
        });

        content.createDiv({
            text: `原文: ${rule.originalText}`,
            cls: 'rule-original'
        });

        content.createDiv({
            text: `译文: ${rule.translatedText}`,
            cls: 'rule-translated'
        });

        // 创建删除按钮
        const deleteButton = ruleItem.createEl('button', {
            text: '删除',
            cls: 'rule-delete-button'
        });
        deleteButton.style.cssText = `
            float: right;
            padding: 4px 8px;
            background: var(--background-modifier-error);
            color: var(--text-on-accent);
            border: none;
            border-radius: 4px;
            cursor: pointer;
        `;

        deleteButton.onclick = () => {
            const key = `${rule.selector}-${rule.originalText}`;
            this.onDeleteRule(key);
        };

        return ruleItem;
    }

    clear() {
        this.rulesContainer.empty();
    }
}
