| id             | CTI-2026-0528-KELPDAO                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| title          | KelpDAO LayerZero ブリッジハッキング —— オフチェーン検証インフラの単一障害点を狙った高度な攻撃                                                                                                                                                       |
| subtitle       | 1-of-1 DVN、RPC ノードポイズニング、そして DeFi 全体へ波及したシステミックリスク                                                                                                                                                               |
| author         | Dennis Kim (김호광 / HoKwang Kim)                                                                                                                                                                                  |
| email          | gameworker@gmail.com                                                                                                                                                                                            |
| github         | gameworkerkim                                                                                                                                                                                                   |
| date           | 2026-05-28                                                                                                                                                                                                      |
| classification | TLP:GREEN                                                                                                                                                                                                       |
| severity       | CRITICAL                                                                                                                                                                                                        |
| lang           | ja                                                                                                                                                                                                              |
| tags           | | Web3-Security | DeFi | Lazarus-Group | Cross-Chain | North-Korea | Bridge-Security | RPC-Compromise | | -------------- | --- | ------------- | ----------- | ------------ | --------------- | --------------- | |
| threat\_actors | | Lazarus Group (TraderTraitor · 北朝鮮系) | | -------------------------------------- |                                                                                                              |
| cve            | 該当なし（スマートコントラクトの欠陥ではなく、オフチェーンインフラの設計上の弱点を突いた攻撃）                                                                                                                                                                  |
| frameworks     | | MITRE ATT&CK (T1566, T1499, T1195, T1583) | NIST SP 800-207 (Zero Trust) | | ----------------------------------------- | ---------------------------- |                                                              |
| license        | CC BY-NC-SA 4.0                                                                                                                                                                                                 |


# KelpDAO LayerZero ブリッジハッキング —— オフチェーン検証インフラの単一障害点を狙った高度な攻撃

> **レポートID** `CTI-2026-0528-KELPDAO` · **発行日** 2026-05-28 · **分類** `TLP:GREEN` · **深刻度** 🔴 CRITICAL
> **著者** Dennis Kim (김호광) · <gameworker@gmail.com> · [@gameworkerkim](https://github.com/gameworkerkim)

*1-of-1 DVN、RPC ノードポイズニング、そして DeFi 全体へ波及したシステミックリスク*

---

## 目次

1. 要約 (TL;DR)
2. 事件概要
3. 技術分析 —— 攻撃ベクトル
4. 影響評価 —— 韓国・Web3 への波及
5. 対応および緩和策
6. 結論と提言
7. 参考文献

---

## 要約 (TL;DR)

2026年4月18日、**北朝鮮系ハッカー集団 Lazarus Group の下部組織 TraderTraitor** が、リキッドリステーキングプロトコル **KelpDAO** の LayerZero ブリッジインフラを攻撃し、**116,500 rsETH（約2億9,200万ドル）** を窃取した。これは **2026年最大の DeFi ハッキング事件**として記録された [1][2]。

特に注目すべきは、本攻撃がスマートコントラクトのバグや価格オラクル操作といった既知の脆弱性ではなく、**オフチェーン検証インフラ（off-chain infrastructure）**の設計上の欠陥を精密に突いた点である。オンチェーン取引そのもの——署名・メッセージ形式・コントラクト呼び出し——がすべて正常に見えたため、既存のオンチェーンセキュリティソリューションはこの攻撃を検知できなかった [1]。

攻撃の核心は以下のとおりである。

1. **1-of-1 単一検証者（DVN）** 設定に起因する単一障害点（Single Point of Failure）[3]
2. **RPC ノードの掌握**：LayerZero Labs DVN が使用する RPC ノード2つに侵入・改竄し、未検証の外部 RPC ノードに DDoS 攻撃を仕掛けて、汚染されたノードへのフェイルオーバー（failover）を誘導 [6]
3. **偽の焼却データの注入**：改竄されたノードを通じて、ソースチェーン上で rsETH が「焼却」されたかのような偽造データを DVN へ伝達
4. **ブリッジコントラクトの不正な資金放出**：正常な検証を経たかのように偽装し、116,500 rsETH を窃取

### Key Judgments

| #    | 判断                                                                                                                          | 確度        |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | ---------- |
| KJ-1 | 本件の根本原因はスマートコントラクトのバグではなく、**1-of-1 DVN というオフチェーン検証構造の単一障害点**であり、LayerZero の既定設定・クイックスタートが 1/1 構造を提示してきた点と相まって、**エコシステム全体の構造的リスク**として定義すべきである。 | **High**   |
| KJ-2 | 攻撃はオンチェーンの側面では完全に正常に見えたため、従来のオンチェーンセキュリティソリューションでは検知不可能だった。**チェーン間不変条件モニタリング（cross-chain invariant monitoring）**のみが、この系統の攻撃を事前に検知できる。 | **High**   |
| KJ-3 | Lazarus/TraderTraitor は **Drift（2.85億ドル）と KelpDAO（2.92億ドル）のわずか2件だけで、2026年の世界の暗号資産ハッキング被害の76%（約5.77億ドル）** を占めた。これは北朝鮮の脅威が韓国の Web3 エコシステムに対する現実的かつ差し迫った脅威であることを意味する。 | **High**   |
| KJ-4 | 窃取された rsETH が Aave 等で無担保借入の担保として再利用され、**単一プロトコルのハッキングが DeFi 全体のシステミックリスク**へと転移した。資産間の相互接続性が伝染（contagion）の経路となった。 | **Medium-High** |
| KJ-5 | Aave 主導の民間連合救済（**DeFi United**）は 2008 年の政府主導救済と対比される新たなマイルストーンだが、同種事件の再発を防ぐ構造的解決策ではなく、上場・担保基準の改革を並行させる必要がある。 | **Medium**      |

---

## 1. 事件概要

### 1.1 基本情報

| 項目 | 内容 |
|------|------|
| **被害対象** | KelpDAO（イーサリアムベースのリキッドリステーキングプロトコル、rsETH を発行） |
| **攻撃日時** | 2026年4月18日 |
| **被害規模** | 116,500 rsETH ≈ 2億9,200万ドル（rsETH 流通量の相当部分）[1][11] |
| **攻撃経路** | LayerZero ブリッジ —— オフチェーン検証インフラ（RPC ノード） |
| **背後** | 北朝鮮偵察総局に連なる Lazarus Group、TraderTraitor 下部組織（LayerZero 公式ポストモーテム・TRM Labs 帰属）[3][10] |
| **二次窃取の阻止** | KelpDAO がコントラクトの一時停止（pause）により、追加で1億ドル超（偽造取引2件）を阻止 [11] |
| **事後対応** | KelpDAO が rsETH コントラクトを凍結、Arbitrum Security Council が約 30,766 ETH（約7,150万ドル）を凍結 [8] |

> ⚠️ **数値訂正メモ**：一次資料の相互検証の結果、本レポートは一部の二次報道で混同された数値を以下のとおり確定する。① Aave が被った不良債権は約 **1.237億～2.301億ドル**水準であり（攻撃者が Aave から借り入れた額は約1.9億ドル）、一部初期報道の「195億ドル」は明白な誤りである。② 主な資金洗浄経路は Tornado Cash ではなく **THORChain を通じた BTC への変換**である（Tornado Cash は事前資金調達の段階でのみ少量使用）。

### 1.2 DeFi エコシステムの連鎖的影響

本ハッキングは単一プロトコルの被害で終わらなかった。攻撃者は無担保で発行された（unbacked）rsETH を Aave V3 に担保として預け入れ、正当な資産を借り入れた。これにより生じた影響は以下のとおりである [4][7][15]。

| 項目 | 内容 |
|------|------|
| **Aave 借入・不良債権** | 攻撃者が Aave から約1.9億ドルを借入、不良債権推定約 1.237億～2.301億ドル |
| **Aave 預入金の流出** | 48時間以内に80億ドル超（一部集計で100億ドル）の純流出 |
| **DeFi 総預入資産（TVL）** | 約130億ドル急減（集計により $99.5B → $83.7B 水準） |
| **連鎖清算危機** | rsETH のデペッグにより eMode 等の高 LTV ポジションが同時に清算閾値へ突入、「ルーピング（looping）」取引が凍結 |

---

## 2. 技術分析 —— 攻撃ベクトル

### 2.1 1-of-1 単一 DVN 設定：根本原因

KelpDAO の rsETH クロスチェーンメッセージングは、**ただ一つの検証者**である LayerZero Labs DVN のみを経由するよう設定されていた。LayerZero では、すべてのクロスチェーンメッセージは宛先チェーンが実行する前に、一つ以上の分散型検証者ネットワーク（DVN）の検証を経なければならない。rsETH は二つ目の DVN の同意を要しない 1-of-1 構造であり、これは本質的に単一障害点を提供する [1][3]。

責任の所在は争点となっている。LayerZero は、複数 DVN の推奨を無視した KelpDAO の選択だと主張する一方、KelpDAO は、LayerZero の公式クイックスタートガイドと既定の GitHub 設定（`layerzero.config.ts`）自体が 1/1 構造を提示しており、LayerZero の担当者が直接安全性を確認したと反論した [5][12]。実際、事件当時アクティブな LayerZero OApp コントラクトの約 **40～47% が同じ 1-of-1 DVN 構成**を使用していた [11][12]。事件後、LayerZero は単一検証者構成に対するメッセージ署名を停止することとし、KelpDAO は rsETH を **Chainlink CCIP** へ移行した [5]。

### 2.2 オフチェーン RPC ノード侵入：実行メカニズム

| 段階 | 説明 |
|------|------|
| **① 内部ノード侵入** | 攻撃者が LayerZero Labs DVN の使用する RPC リストにアクセスし、RPC ノード2つに侵入、ノード上で実行されるバイナリを差し替え [11] |
| **② DDoS でフェイルオーバー誘導** | 侵害されていない（uncompromised）外部 RPC ノードに DDoS 攻撃を仕掛け、システムを汚染ノードへフェイルオーバーするよう強制 [6][11] |
| **③ 偽造データ注入** | 改竄されたノードが、ソースチェーン上で rsETH が「焼却（burn）」されたかのような虚偽の状態データを DVN へ送信 |
| **④ ブリッジコントラクト実行** | DVN が偽の焼却データを正常と検証したことにより、イーサリアムのブリッジコントラクトが 116,500 rsETH を攻撃者アドレスへ放出 |

Chainalysis の分析によれば、LayerZero が 1-of-1 RPC クォーラムを既定値としていたため、ノード1つが汚染されただけで、DVN は他ノードとの相互検証なしに偽造メッセージへ署名した [5]。

### 2.3 既存セキュリティソリューションの検知失敗

すべてのオンチェーン取引の署名・メッセージ形式・コントラクト呼び出しが完全に正常に見えたため、従来のスマートコントラクトベースのセキュリティソリューションはこの攻撃をまったく検知できなかった [1]。これを検知するには、**チェーン間不変条件モニタリング（cross-chain invariant monitoring）**——すなわち宛先チェーンで解放されたトークンがソースチェーンで焼却されたトークンと数学的に一致するかを継続的に検証する方式——が必要である。

### 2.4 資金洗浄と凍結

窃取資金は約36時間以内に約1.75億ドル相当が **THORChain** を通じて BTC へ変換され、その後の洗浄段階は北朝鮮ではなく中国系の仲介者が主に処理したと分析される [10][30]。事前資金調達の一部は、2018年に Lazarus の資金洗浄で起訴された中国人ブローカー、ウー・フイフイ（Wu Huihui）が管理するウォレットと BTCTurk ハッキングにまで追跡された [26]。しかし、**Arbitrum Security Council** が法執行機関と協力し、約 30,766 ETH（約7,150万ドル）の凍結に成功した [8]。

---

## 3. 影響評価 —— 韓国・Web3 への波及

### 3.1 韓国への影響

**① Web3・仮想資産業界の信頼危機** —— KelpDAO は韓国の投資家・開発者コミュニティでも注目されていたプロジェクトである。rsETH が主要なレイヤー2 や Aave 等で広く使用されていた点を踏まえると、国内利用者の間接的被害の可能性も排除できない。

**② 金融当局の規制監視強化** —— 仮想資産利用者保護法の施行以降、規制を強化してきた金融当局は、本件を契機に DeFi プロトコルのクロスチェーンリスク管理基準を厳格に検討する可能性が高い。特に「オフチェーンインフラ」のセキュリティ水準を評価指標に含める方向が予想される。

**③ 北朝鮮サイバー脅威の認識向上** —— 2026年初頭、Drift Protocol（約2億8,500万ドル）と KelpDAO（約2億9,200万ドル）のわずか2件のハッキングだけで、北朝鮮は世界の暗号資産ハッキング被害額の約 **76%（約5.77億ドル）** を占めた [24][26]。北朝鮮のシェアは 2022年の22%、2023年の37%、2024年の39%、2025年の64% から、2026年には76% へと過去最高を記録した [25]。国内のセキュリティ業界と金融当局との間の情報共有体制の強化が急務である。

**④ 国内取引所・DeFi サービスの対応** —— 国内の主要取引所は rsETH および関連デリバティブの上場見直しとリスク評価基準の強化に乗り出すとみられ、単一検証者構造を持つクロスチェーン資産に対する別途の審査の導入を検討するものと予想される。

### 3.2 Web3 業界への影響

**① クロスチェーンブリッジへの信頼低下と移行** —— 中核的脆弱性は LayerZero プロトコル自体ではなく DVN の設定方式にあったが、クロスチェーンブリッジのセキュリティモデル全般の再検討は避けられなくなった。実際、KelpDAO（約15億ドル）、SolvProtocol（約6億ドル）など合計 TVL 約20億ドル規模のプロトコルが、LayerZero から **Chainlink CCIP**（検証に最低16の独立ノードオペレーターを要求）へ移行している [9]。

**② オフチェーンセキュリティソリューション市場の急成長** —— オンチェーン中心のセキュリティの限界が露呈したことで、オフチェーンインフラ監視・RPC エンドポイント診断・クロスチェーン状態検証ソリューションへの需要が急増する見通しである。

**③ 'DeFi United' —— 業界連合救済の新たなマイルストーン** —— Aave 主導で発足した民間連合救済イニシアチブである。**最大の貢献者は当初伝えられた LayerZero・EtherFi ではなく、Mantle と Aave DAO** である [15][18]。

| 参加者 | 貢献内容 |
|--------|----------|
| Mantle Treasury | 最大 30,000 ETH（3年与信、Lido ステーキング利回り +1%） |
| Aave DAO | 25,000 ETH（ガバナンス投票進行中）—— Mantle と合算で 55,000 ETH（約1.27億ドル） |
| Consensys / Joseph Lubin | 最大 30,000 ETH |
| Stani Kulechov（Aave 創設者） | 個人で 5,000 ETH |
| EtherFi | 5,000 ETH |
| Lido DAO | 最大 2,500 stETH（約570万ドル） |
| その他 | Golem Foundation 1,000 ETH、Aave VP 500 ETH、Ethena・LayerZero・Ink・Frax・Tydro 等 |

DeFi United は4月25日時点で約1.6億ドルを調達し、必要額約2億ドルの約80%を満たした [17]。こうした民間主導の対応は 2008 年の政府主導の銀行救済と対比され、DeFi の成熟度を示す事例として評価される。

**④ Aave の担保・上場基準の全面的見直し** —— Aave は担保資産の評価基準を価格変動性のみならずサイバーセキュリティ・相互運用性・基盤アーキテクチャまで拡大し、新規資産発行者向けの公式プレイブックとプール間のシステミックな相互接続性調査を導入することとした。

---

## 4. 対応および緩和策

### 4.1 クロスチェーンブリッジのアーキテクチャレベル

| 区分 | 対応策 | 優先度 |
|------|----------|----------|
| DVN 構成 | **単一検証者（1-of-1）→ 複数検証者（≥2-of-N）への転換**が必須 | ★★★★★ |
| RPC セキュリティ | RPC エンドポイントのアクセス制御・地理的分散・認証ノード専用、RPC クォーラムの多重化 | ★★★★★ |
| 状態検証 | 軽量クライアント（Light Client）または ZKP ベースの暗号学的検証の導入 | ★★★★☆ |
| モニタリング | **クロスチェーン不変条件モニタリング** —— ソースチェーンの焼却量と宛先チェーンの解放量をリアルタイムで照合 | ★★★★☆ |

### 4.2 DeFi プロトコルレベル

| 区分 | 対応策 |
|------|----------|
| **上場基準** | 資産上場時に単一障害点・オフチェーンインフラのセキュリティ水準を評価指標に含める |
| **リスクパラメータ** | eMode 等の高 LTV 設定時に、クロスチェーンインフラリスクを価格変動性と同等の水準で反映 |
| **緊急対応** | KelpDAO の迅速なコントラクト凍結（追加1億ドル+を阻止）事例をベンチマークした早期警報・自動凍結メカニズム |
| **ポストモーテム共有** | ハッキング発生時に詳細な技術分析・教訓を業界と共有する文化の定着 |

### 4.3 規制・政策レベル（韓国）

| 区分 | 対応策 |
|------|----------|
| **規制フレームワーク** | 仮想資産利用者保護法に「クロスチェーンリスク評価」項目を追加する検討 |
| **情報共有体制** | KISA・金融保安院・主要取引所間で DeFi 脅威情報共有協議体を構成 |
| **国際協調** | Chainalysis・TRM Labs 等のグローバルなオンチェーンインテリジェンス企業との協力拡大 |
| **投資家教育** | 「単一検証者ブリッジ」等の高リスク DeFi 構成に関する投資家警告ガイドラインの整備 |

### 4.4 セキュリティ業界・開発者レベル

| 区分 | 対応策 |
|------|----------|
| **オフチェーンセキュリティ診断** | RPC ノードインフラを対象とした定期的な侵入テスト・脆弱性診断の義務化 |
| **セキュアコーディング** | クロスチェーンブリッジ実装時に「単一障害点の禁止」原則を含むガイドラインの配布 |
| **AI セキュリティの活用** | 「偽の焼却」のようなオフチェーンの異常兆候の検知に AI/機械学習モデルを活用 |

---

## 5. 結論と提言

KelpDAO 事件は単なる一件のハッキングではなく、**クロスチェーンブリッジのオフチェーン検証層**という防御の死角を明確に露呈した構造的事件である。オンチェーンは完璧に正常に見えたが、信頼の源であるオフチェーン RPC が汚染された瞬間、システム全体が崩壊した。

エコシステムの参加者は、以下の前提の上でクロスチェーン資産を扱わねばならない。

1. **単一検証者（1-of-1）構成は非信頼（untrusted）とみなす**。複数 DVN・複数 RPC クォーラムなしに運用資産を載せない。
2. **オンチェーンの正常性 ≠ 安全**。チェーン間不変条件モニタリングなしには、この系統の攻撃を検知できない。
3. **資産間の相互接続性はすなわち伝染経路である**。担保資産のインフラリスクを価格リスクと同等に扱わねばならない。
4. **北朝鮮の脅威は差し迫った国家安全保障事案である**。2件のハッキングで世界の被害の76%を占めた現実は、国内のガバナンス・情報共有体制の即時強化を要求する。

セキュリティは速度の反対語ではなく、速度を長く維持するための設計である。クロスチェーンエコシステムが爆発的に採用される今、オフチェーン検証層の構造的欠陥を放置すれば、その後の被害は複利で増大する。

---

## 参考文献 (References)

[1] Chainalysis, "Inside the KelpDAO Bridge Exploit", 2026. <https://www.chainalysis.com/blog/kelpdao-bridge-exploit-april-2026/>

[2] Galaxy Research, "KelpDAO/LayerZero Exploit Drains $290m, Freezes DeFi Markets", 2026.

[3] LayerZero, "KelpDAO Incident Statement", 2026-04-19. <https://layerzero.network/blog/kelpdao-incident-statement>

[4] CoinDesk, "Aave rallies DeFi partners to contain fallout from $292 million KelpDAO hack", 2026-04-23. <https://www.coindesk.com/business/2026/04/23/aave-rallies-defi-partners-to-contain-fallout-from-usd292-million-kelpdao-hack>

[5] Bitcoin.com News, "KelpDAO Slams LayerZero After $300M Exploit, Shifts rsETH to Chainlink CCIP", 2026. <https://news.bitcoin.com/kelpdao-slams-layerzero-after-300m-exploit-shifts-rseth-to-chainlink-ccip/>

[6] MEXC News, "LayerZero Labs open letter attempts to explain failures around KelpDAO hack", 2026-05-08. <https://www.mexc.com/news/1080101>

[7] Decrypt, "Aave Leads 'DeFi United' Push to Contain $292M KelpDAO Fallout", 2026-04-24. <https://decrypt.co/365431/aave-leads-defi-united-push-to-contain-292m-kelpdao-fallout>

[8] incrypted, "KelpDAO Accused LayerZero of an Infrastructure Failure Following the Hack", 2026. <https://incrypted.com/en/kelpdao-accused-layerzero-of-an-infrastructure-failure-following-the-hack/>

[9] coinpaper, "LayerZero, Lazarus and KelpDAO: The Full Story Behind the $292M Bridge Exploit", 2026. <https://coinpaper.com/16938/layer-zero-lazarus-and-kelp-dao-the-full-story-behind-the-bridge-exploit>

[10] The Block, "North Korea accounts for 76% of 2026 crypto hack losses…: TRM Labs", 2026. <https://www.theblock.co/post/399569/>

[11] CoinDesk, "Kelp says LayerZero approved setup it blamed for $292 million bridge hack", 2026-05-05. <https://www.coindesk.com/web3/2026/05/05/kelp-claims-that-layerzero-approved-the-setup-it-blamed-for-usd292-million-bridge-hack>

[12] CoinDesk, "Kelp DAO claims LayerZero's default settings are what actually caused the $290 million disaster", 2026-04-20. <https://www.coindesk.com/tech/2026/04/20/kelp-dao-claims-layerzero-s-default-settings-are-what-actually-caused-the-usd290-million-disaster>

[15] Decrypt, "Aave Leads 'DeFi United' Push…", 2026-04-24（不良債権推定 $123.7M–$230.1M）. <https://decrypt.co/365431/>

[17] CoinDesk, "Aave raises nearly 80% of the $200 million it needs to cover bad debt left by Kelp DAO exploit", 2026-04-26. <https://www.coindesk.com/business/2026/04/26/>

[18] KuCoin, "DeFi United Raises $160M to Cover Aave Bad Debt from KelpDAO Exploit", 2026. <https://www.kucoin.com/news/flash/defi-united-raises-160m-to-cover-aave-bad-debt-from-kelpdao-exploit>

[24] The Block, "North Korea accounts for 76% of 2026 crypto hack losses, with theft since 2017 topping $6 billion: TRM Labs", 2026.

[25] crypto.news, "TRM Labs: North Korea-linked hackers drive 76% of 2026 crypto thefts", 2026. <https://crypto.news/trm-labs-north-korea-linked-hackers-drive-76-of-2026-crypto-thefts/>

[26] TRM Labs, "North Korea Stole 76% of All Crypto Hack Value in 2026 — With Just Two Attacks", 2026. <https://www.trmlabs.com/resources/blog/north-korea-stole-76-of-all-crypto-hack-value-in-2026-with-just-two-attacks>

[30] spaziocrypto, "North Korea: 76% of Crypto Hack Losses in 4 Months, 2026", 2026. <https://en.spaziocrypto.com/defi/north-korea-76-percent-crypto-hack-losses-2026/>

---

© 2026 Dennis Kim (김호광) · 本文書は独立した CTI アーカイブ（TLP:GREEN）として公開される。
連絡先：<gameworker@gmail.com> · GitHub: [gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT](https://github.com/gameworkerkim/CYBER-THREAT-INTELLIGENCE-REPORT)
